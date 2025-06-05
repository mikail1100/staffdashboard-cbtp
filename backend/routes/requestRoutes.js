const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middleware/auth');
const staffMiddleware = require('../middleware/staff');

// @route   GET /api/requests
// @desc    Get all requests (with optional filtering)
// @access  Private (Staff)
router.get('/', authMiddleware, staffMiddleware, requestController.getAllRequests);

// @route   GET /api/requests/:id
// @desc    Get request details
// @access  Private (Staff)
router.get('/:id', authMiddleware, staffMiddleware, requestController.getRequestDetails);

// @route   PUT /api/requests/:id/approve
// @desc    Approve a request and schedule appointment
// @access  Private (Staff)
router.put('/:id/approve', authMiddleware, staffMiddleware, requestController.approveRequest);

// @route   PUT /api/requests/:id/reject
// @desc    Reject a request
// @access  Private (Staff)
router.put('/:id/reject', authMiddleware, staffMiddleware, requestController.rejectRequest);

module.exports = router;