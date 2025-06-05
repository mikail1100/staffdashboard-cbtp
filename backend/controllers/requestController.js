const Request = require('../models/Request');
const Appointment = require('../models/Appointment');
const Resident = require('../models/Resident');
const config = require('../config/config');
const { sendEmail } = require('../utils/emailService');

// Get all requests with filtering
exports.getAllRequests = async (req, res) => {
  try {
    const { status, serviceType } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (serviceType) filter.serviceType = serviceType;

    const requests = await Request.find(filter)
      .populate('userId', 'name email')
      .populate('processedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });

  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ 
      success: false,
      message: config.messages.serverError 
    });
  }
};

// Get request details
exports.getRequestDetails = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('userId', 'name email phoneNumber')
      .populate('processedBy', 'name');

    if (!request) {
      return res.status(404).json({ 
        success: false,
        message: 'Request not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: request
    });

  } catch (error) {
    console.error('Get request details error:', error);
    res.status(500).json({ 
      success: false,
      message: config.messages.serverError 
    });
  }
};

// Approve request
exports.approveRequest = async (req, res) => {
  try {
    const { appointmentDate } = req.body;

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ 
        success: false,
        message: 'Request not found' 
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ 
        success: false,
        message: 'Request is not in pending status' 
      });
    }

    // Update request status
    request.status = 'approved';
    request.processedBy = req.user.id;
    request.updatedAt = new Date();
    await request.save();

    // Create appointment
    const appointment = new Appointment({
      requestId: request._id,
      userId: request.userId,
      staffId: req.user.id,
      serviceType: request.serviceType,
      appointmentDate,
      status: 'scheduled'
    });
    await appointment.save();

    // Send approval email to user
    await sendEmail({
      to: request.userEmail,
      subject: `Your ${request.serviceType} Request Has Been Approved`,
      text: `Dear ${request.userName},\n\nYour request for ${request.serviceType} has been approved.\n\nPlease come to the kebele office on ${new Date(appointmentDate).toLocaleString()} to complete the process.\n\nThank you.`
    });

    res.status(200).json({
      success: true,
      message: 'Request approved successfully',
      data: {
        request,
        appointment
      }
    });

  } catch (error) {
    console.error('Approve request error:', error);
    res.status(500).json({ 
      success: false,
      message: config.messages.serverError 
    });
  }
};

// Reject request
exports.rejectRequest = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ 
        success: false,
        message: 'Request not found' 
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ 
        success: false,
        message: 'Request is not in pending status' 
      });
    }

    // Update request status
    request.status = 'rejected';
    request.processedBy = req.user.id;
    request.rejectionReason = rejectionReason;
    request.updatedAt = new Date();
    await request.save();

    // Send rejection email to user
    await sendEmail({
      to: request.userEmail,
      subject: `Your ${request.serviceType} Request Has Been Rejected`,
      text: `Dear ${request.userName},\n\nWe regret to inform you that your request for ${request.serviceType} has been rejected.\n\nReason: ${rejectionReason}\n\nPlease correct the issues and resubmit your application.\n\nThank you.`
    });

    res.status(200).json({
      success: true,
      message: 'Request rejected successfully',
      data: request
    });

  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({ 
      success: false,
      message: config.messages.serverError 
    });
  }
};