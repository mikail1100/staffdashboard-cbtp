const Resident = require('../models/Resident');
const Staff = require('../models/Staff');
const config = require('../config/config');
const { sendEmail } = require('../utils/emailService');
const bcrypt = require('bcryptjs');

// Register new resident (by staff)
exports.registerResident = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      grandFatherName,
      placeOfBirth,
      region,
      woreda,
      zone,
      houseNo,
      email,
      gender,
      dateOfBirth,
      motherFullName,
      fatherFullName
    } = req.body;

    // Check if resident already exists
    const existingResident = await Resident.findOne({ email });
    if (existingResident) {
      return res.status(400).json({ 
        success: false,
        message: 'Resident with this email already exists' 
      });
    }

    // Create new resident (pending approval)
    const newResident = new Resident({
      name,
      fatherName,
      grandFatherName,
      placeOfBirth: placeOfBirth || config.settings.defaultCountry,
      region,
      woreda,
      zone,
      nationality: config.settings.defaultNationality,
      houseNo,
      email,
      gender,
      dateOfBirth,
      motherFullName,
      motherNationality: config.settings.defaultNationality,
      fatherFullName,
      fatherNationality: config.settings.defaultNationality,
      registeredBy: req.user.id,
      status: 'pending'
    });

    await newResident.save();

    res.status(201).json({
      success: true,
      message: 'Resident registration submitted for admin approval',
      data: newResident
    });

  } catch (error) {
    console.error('Register resident error:', error);
    res.status(500).json({ 
      success: false,
      message: config.messages.serverError 
    });
  }
};

// Get all residents (for admin approval)
exports.getAllResidents = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: config.messages.accessDenied 
      });
    }

    const { status } = req.query;
    const filter = status ? { status } : {};

    const residents = await Resident.find(filter)
      .populate('registeredBy', 'name')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: residents.length,
      data: residents
    });

  } catch (error) {
    console.error('Get residents error:', error);
    res.status(500).json({ 
      success: false,
      message: config.messages.serverError 
    });
  }
};

// Approve resident registration (admin only)
exports.approveResident = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: config.messages.accessDenied 
      });
    }

    const resident = await Resident.findById(req.params.id);
    if (!resident) {
      return res.status(404).json({ 
        success: false,
        message: 'Resident not found' 
      });
    }

    if (resident.status !== 'pending') {
      return res.status(400).json({ 
        success: false,
        message: 'Resident registration is not in pending status' 
      });
    }

    // Generate a random password
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update resident status and set password
    resident.status = 'approved';
    resident.approvedBy = req.user.id;
    resident.password = hashedPassword;
    await resident.save();

    // Send approval email with credentials
    await sendEmail({
      to: resident.email,
      subject: 'Your Kebele Resident Account Has Been Approved',
      text: `Dear ${resident.name},\n\nYour resident registration has been approved.\n\nYou can now login to the Kebele Management System using:\n\nEmail: ${resident.email}\nPassword: ${password}\n\nPlease change your password after first login.\n\nThank you.`
    });

    res.status(200).json({
      success: true,
      message: 'Resident approved successfully',
      data: resident
    });

  } catch (error) {
    console.error('Approve resident error:', error);
    res.status(500).json({ 
      success: false,
      message: config.messages.serverError 
    });
  }
};

// Reject resident registration (admin only)
exports.rejectResident = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: config.messages.accessDenied 
      });
    }

    const { rejectionReason } = req.body;
    const resident = await Resident.findById(req.params.id);
    if (!resident) {
      return res.status(404).json({ 
        success: false,
        message: 'Resident not found' 
      });
    }

    if (resident.status !== 'pending') {
      return res.status(400).json({ 
        success: false,
        message: 'Resident registration is not in pending status' 
      });
    }

    // Update resident status
    resident.status = 'rejected';
    resident.rejectionReason = rejectionReason;
    await resident.save();

    // Send rejection email
    await sendEmail({
      to: resident.email,
      subject: 'Your Kebele Resident Registration Has Been Rejected',
      text: `Dear ${resident.name},\n\nYour resident registration has been rejected.\n\nReason: ${rejectionReason}\n\nPlease contact the kebele office for more information.\n\nThank you.`
    });

    res.status(200).json({
      success: true,
      message: 'Resident rejected successfully',
      data: resident
    });

  } catch (error) {
    console.error('Reject resident error:', error);
    res.status(500).json({ 
      success: false,
      message: config.messages.serverError 
    });
  }
};