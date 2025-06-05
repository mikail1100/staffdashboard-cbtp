const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Staff = require('../models/Staff');
const config = require('../config/config');
const { sendEmail } = require('../utils/emailService');

// Staff login
exports.staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if staff exists
    const staff = await Staff.findOne({ email });
    if (!staff) {
      return res.status(401).json({ 
        success: false,
        message: config.messages.invalidCredentials 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: config.messages.invalidCredentials 
      });
    }

    // Check if staff is active
    if (!staff.isActive) {
      return res.status(403).json({ 
        success: false,
        message: 'Your account has been deactivated. Please contact admin.' 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: staff._id, role: staff.role },
      config.auth.jwtSecret,
      { expiresIn: config.auth.jwtExpiresIn }
    );

    // Remove password from response
    const staffData = staff.toObject();
    delete staffData.password;

    res.status(200).json({
      success: true,
      token,
      user: staffData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: config.messages.serverError 
    });
  }
};

// Admin login (hardcoded credentials)
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== config.auth.adminEmail || password !== config.auth.adminPassword) {
      return res.status(401).json({ 
        success: false,
        message: config.messages.invalidCredentials 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: 'admin', role: 'admin' },
      config.auth.jwtSecret,
      { expiresIn: config.auth.jwtExpiresIn }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: 'admin',
        name: 'Admin',
        email: config.auth.adminEmail,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false,
      message: config.messages.serverError 
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    let user;
    if (req.user.role === 'staff') {
      user = await Staff.findById(req.user.id).select('-password');
    } else {
      // For admin (hardcoded)
      user = {
        id: 'admin',
        name: 'Admin',
        email: config.auth.adminEmail,
        role: 'admin'
      };
    }

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false,
      message: config.messages.serverError 
    });
  }
};