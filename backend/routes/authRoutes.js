const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// @route   POST /api/auth/staff/login
// @desc    Authenticate staff & get token
// @access  Public
router.post('/staff/login', authController.staffLogin);

// @route   POST /api/auth/admin/login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/admin/login', authController.adminLogin);

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;