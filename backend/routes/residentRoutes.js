const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');
const authMiddleware = require('../middleware/auth');
const staffMiddleware = require('../middleware/staff');
const adminMiddleware = require('../middleware/admin');

// @route   POST /api/residents
// @desc    Register new resident (pending admin approval)
// @access  Private (Staff)
router.post('/', authMiddleware, staffMiddleware, residentController.registerResident);

// @route   GET /api/residents
// @desc    Get all residents (with optional filtering)
// @access  Private (Admin)
router.get('/', authMiddleware, adminMiddleware, residentController.getAllResidents);

// @route   PUT /api/residents/:id/approve
// @desc    Approve resident registration
// @access  Private (Admin)
router.put('/:id/approve', authMiddleware, adminMiddleware, residentController.approveResident);

// @route   PUT /api/residents/:id/reject
// @desc    Reject resident registration
// @access  Private (Admin)
router.put('/:id/reject', authMiddleware, adminMiddleware, residentController.rejectResident);

module.exports = router;