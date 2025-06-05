const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express(); // ✅ DEFINE app BEFORE any app.use()

const User = require('./models/User');
const Request = require('./models/Request');
const Announcement = require('./models/Announcement');
const Feedback = require('./models/Feedback');
const Support = require('./models/Support');

// Import routes
const authRoutes = require('./routes/authRoutes');
const staffRoutes = require('./routes/staffRoutes');
const requestRoutes = require('./routes/requestRoutes');
const residentRoutes = require('./routes/residentRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/appointments', appointmentRoutes);

// ...rest of your code


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

module.exports = app;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Email configuration
/*const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});*/

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Generate unique user ID
const generateUserId = () => {
  return '#' + Math.floor(Math.random() * 9000000) + 1000000;
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kebele-management')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for admin login
    if (email === 'admin@kebele.gov.et' && password === 'admin123') {
      const token = jwt.sign(
        { id: 'admin', email, role: 'admin' },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );
      return res.json({
        token,
        user: {
          id: 'admin',
          email,
          fullName: 'System Administrator',
          role: 'admin',
          userId: '#ADMIN001'
        }
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isApproved && user.role === 'user') {
      return res.status(400).json({ message: 'Account not approved yet' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        userId: user.userId
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Staff registration by admin
app.post('/api/admin/register-staff', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { fullName, email, password, personalInfo } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const userId = generateUserId();
    const user = new User({
      fullName,
      email,
      password,
      role: 'staff',
      userId,
      personalInfo,
      isApproved: true
    });

    await user.save();

    // Send email with credentials
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Staff Account Created - Kebele Management System',
      html: `
        <h2>Welcome to Kebele Management System</h2>
        <p>Your staff account has been created successfully.</p>
        <p><strong>Login Credentials:</strong></p>
        <p>Email: ${email}</p>
        <p>Password: ${password}</p>
        <p>Please login and change your password.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Staff registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Resident registration by staff
app.post('/api/staff/register-resident', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Staff access required' });
    }

    const { fullName, email, personalInfo } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const userId = generateUserId();
    const user = new User({
      fullName,
      email,
      password: 'temp123', // Temporary password
      role: 'user',
      userId,
      personalInfo,
      isApproved: false
    });

    await user.save();

    res.status(201).json({ message: 'Resident registration submitted for approval' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get pending residents for admin approval
app.get('/api/admin/pending-residents', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const pendingResidents = await User.find({ 
      role: 'user', 
      isApproved: false 
    }).select('-password');

    res.json(pendingResidents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve resident
app.post('/api/admin/approve-resident/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { password } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password;
    user.isApproved = true;
    user.approvedBy = req.user.id;
    await user.save();

    // Send approval email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Account Approved - Kebele Management System',
      html: `
        <h2>Account Approved</h2>
        <p>Dear ${user.fullName},</p>
        <p>Your account has been approved successfully.</p>
        <p><strong>Login Credentials:</strong></p>
        <p>Email: ${user.email}</p>
        <p>Password: ${password}</p>
        <p>You can now login to access our services.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Resident approved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit service request
app.post('/api/requests', authenticateToken, upload.array('documents'), async (req, res) => {
  try {
    const { serviceType, formData } = req.body;
    
    const documents = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      mimetype: file.mimetype
    })) : [];

    const request = new Request({
      userId: req.user.id,
      serviceType,
      formData: JSON.parse(formData),
      documents
    });

    await request.save();

    res.status(201).json({ message: 'Request submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get requests (for staff)
app.get('/api/staff/requests', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Staff access required' });
    }

    const requests = await Request.find()
      .populate('userId', 'fullName email userId')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's requests
app.get('/api/user/requests', authenticateToken, async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Process request (approve/reject)
app.post('/api/staff/process-request/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Staff access required' });
    }

    const { action, rejectionReason, appointment } = req.body;
    const request = await Request.findById(req.params.id).populate('userId');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = action;
    request.processedBy = req.user.id;
    request.processedAt = new Date();

    if (action === 'rejected') {
      request.rejectionReason = rejectionReason;
    } else if (action === 'approved' && appointment) {
      request.appointment = appointment;
    }

    await request.save();

    // Send email notification
    const user = request.userId;
    let emailSubject, emailContent;

    if (action === 'approved') {
      emailSubject = 'Request Approved - Kebele Management System';
      emailContent = `
        <h2>Request Approved</h2>
        <p>Dear ${user.fullName},</p>
        <p>Your ${request.serviceType} certificate request has been approved.</p>
        ${appointment ? `
          <p><strong>Appointment Details:</strong></p>
          <p>Date: ${appointment.date}</p>
          <p>Time: ${appointment.time}</p>
          <p>Location: ${appointment.location}</p>
        ` : ''}
        <p>Thank you for using our services.</p>
      `;
    } else {
      emailSubject = 'Request Rejected - Kebele Management System';
      emailContent = `
        <h2>Request Rejected</h2>
        <p>Dear ${user.fullName},</p>
        <p>Unfortunately, your ${request.serviceType} certificate request has been rejected.</p>
        <p><strong>Reason:</strong> ${rejectionReason}</p>
        <p>Please make the necessary corrections and resubmit your application.</p>
      `;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: emailSubject,
      html: emailContent
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: `Request ${action} successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Dashboard statistics
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    let stats = {};

    if (req.user.role === 'admin') {
      const totalRequests = await Request.countDocuments();
      const pendingRequests = await Request.countDocuments({ status: 'pending' });
      const approvedRequests = await Request.countDocuments({ status: 'approved' });
      const rejectedRequests = await Request.countDocuments({ status: 'rejected' });
      const totalUsers = await User.countDocuments({ role: 'user' });
      const totalStaff = await User.countDocuments({ role: 'staff' });

      stats = {
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        totalUsers,
        totalStaff
      };
    } else if (req.user.role === 'staff') {
      const pendingRequests = await Request.countDocuments({ status: 'pending' });
      const approvedRequests = await Request.countDocuments({ status: 'approved' });
      const rejectedRequests = await Request.countDocuments({ status: 'rejected' });
      const appointments = await Request.countDocuments({ 
        status: 'approved', 
        'appointment.date': { $exists: true } 
      });

      stats = {
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        appointments
      };
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Announcements
app.post('/api/admin/announcements', authenticateToken, upload.single('backgroundImage'), async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { title, message } = req.body;
    const backgroundImage = req.file ? req.file.filename : null;

    const announcement = new Announcement({
      title,
      message,
      backgroundImage,
      createdBy: req.user.id
    });

    await announcement.save();

    res.status(201).json({ message: 'Announcement created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/announcements', authenticateToken, async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Feedback
app.post('/api/feedback', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;

    const feedback = new Feedback({
      userId: req.user.id,
      message
    });

    await feedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/admin/feedback', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const feedback = await Feedback.find()
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 });

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Support
app.post('/api/support', authenticateToken, async (req, res) => {
  try {
    const { issueType, priority, subject, description, applicationId } = req.body;

    const support = new Support({
      userId: req.user.id,
      issueType,
      priority,
      subject,
      description,
      applicationId
    });

    await support.save();

    res.status(201).json({ message: 'Support request submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/admin/support', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const supportRequests = await Support.find()
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 });

    res.json(supportRequests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
