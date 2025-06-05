const Appointment = require('../models/Appointment');
const Request = require('../models/Request');
const Staff = require('../models/Staff');
const Resident = require('../models/Resident');
const config = require('../config/config');
const { sendEmail } = require('../utils/emailService');

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const { status, date } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filter.appointmentDate = { $gte: startDate, $lte: endDate };
    }

    // Staff can only see their own appointments
    if (req.user.role === 'staff') {
      filter.staffId = req.user.id;
    }

    const appointments = await Appointment.find(filter)
      .populate('userId', 'name email phoneNumber')
      .populate('staffId', 'name')
      .populate('requestId', 'serviceType')
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });

  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ 
      success: false,
      message: config.messages.serverError 
    });
  }
};

// Complete appointment
exports.completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('requestId');

    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        message: 'Appointment not found' 
      });
    }

    if (appointment.status !== 'scheduled') {
      return res.status(400).json({ 
        success: false,
        message: 'Appointment is not in scheduled status' 
      });
    }

    // Update appointment status
    appointment.status = 'completed';
    appointment.completedAt = new Date();
    await appointment.save();

    // Update associated request if exists
    if (appointment.requestId) {
      const request = await Request.findById(appointment.requestId._id);
      if (request) {
        request.status = 'completed';
        await request.save();
      }
    }

    // Send completion email to user
    await sendEmail({
      to: appointment.userId.email,
      subject: 'Your Kebele Appointment Has Been Completed',
      text: `Dear ${appointment.userId.name},\n\nYour appointment for ${appointment.serviceType} has been marked as completed.\n\nThank you for using our services.`
    });

    res.status(200).json({
      success: true,
      message: 'Appointment marked as completed',
      data: appointment
    });

  } catch (error) {
    console.error('Complete appointment error:', error);
    res.status(500).json({ 
      success: false,
      message: config.messages.serverError 
    });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    const appointment = await Appointment.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('requestId');

    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        message: 'Appointment not found' 
      });
    }

    if (appointment.status !== 'scheduled') {
      return res.status(400).json({ 
        success: false,
        message: 'Appointment is not in scheduled status' 
      });
    }

    // Update appointment status
    appointment.status = 'cancelled';
    appointment.cancellationReason = cancellationReason;
    await appointment.save();

    // Send cancellation email to user
    await sendEmail({
      to: appointment.userId.email,
      subject: 'Your Kebele Appointment Has Been Cancelled',
      text: `Dear ${appointment.userId.name},\n\nYour appointment for ${appointment.serviceType} has been cancelled.\n\nReason: ${cancellationReason}\n\nPlease schedule a new appointment if needed.\n\nThank you.`
    });

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });

  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ 
      success: false,
      message: config.messages.serverError 
    });
  }
};