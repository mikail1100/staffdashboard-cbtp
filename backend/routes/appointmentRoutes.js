const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/auth');
const staffMiddleware = require('../middleware/staff');

// @route   GET /api/appointments
// @desc    Get all appointments (with optional filtering)
// @access  Private (Staff/Admin)
router.get('/', authMiddleware, appointmentController.getAllAppointments);

// @route   PUT /api/appointments/:id/complete
// @desc    Mark appointment as completed
// @access  Private (Staff)
router.put('/:id/complete', authMiddleware, staffMiddleware, appointmentController.completeAppointment);

// @route   PUT /api/appointments/:id/cancel
// @desc    Cancel appointment
// @access  Private (Staff)
router.put('/:id/cancel', authMiddleware, staffMiddleware, appointmentController.cancelAppointment);

module.exports = router;