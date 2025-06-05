const fs = require('fs');
const path = require('path');
const config = require('../config/config');

/**
 * Log information to console and file
 * @param {string} message - Message to log
 */
const logInfo = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[INFO] ${timestamp} - ${message}\n`;
  
  console.log(logMessage.trim());
  appendToLogFile(logMessage);
};

/**
 * Log error to console and file
 * @param {string} message - Error message
 * @param {Error} [error] - Error object
 */
const logError = (message, error = null) => {
  const timestamp = new Date().toISOString();
  let logMessage = `[ERROR] ${timestamp} - ${message}\n`;
  
  if (error) {
    logMessage += `Stack Trace: ${error.stack}\n`;
  }
  
  console.error(logMessage.trim());
  appendToLogFile(logMessage);
};

/**
 * Append message to log file
 * @param {string} message - Message to append
 */
const appendToLogFile = (message) => {
  const logDir = path.join(__dirname, '../logs');
  const logFile = path.join(logDir, 'kebele-system.log');
  
  try {
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    // Append to log file
    fs.appendFileSync(logFile, message);
  } catch (err) {
    console.error('Failed to write to log file:', err);
  }
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validate phone number (Ethiopian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const validatePhone = (phone) => {
  const re = /^(\+251|0)[9][0-9]{8}$/;
  return re.test(phone);
};

/**
 * Generate random password
 * @param {number} [length=8] - Length of password
 * @returns {string} - Generated password
 */
const generatePassword = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return password;
};

/**
 * Format date to Ethiopian format (YYYY-MM-DD)
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
const formatEthiopianDate = (date) => {
  const ethiopianDate = new Date(date);
  // Adjust for Ethiopian timezone if needed
  return ethiopianDate.toISOString().split('T')[0];
};

/**
 * Handle file uploads with validation
 * @param {Object} file - File object from multer
 * @param {string} uploadPath - Path to save the file
 * @returns {Promise<Object>} - Result of upload
 */
const handleFileUpload = async (file, uploadPath) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Check file size
    if (file.size > config.settings.maxFileSize) {
      throw new Error(`File size exceeds ${config.settings.maxFileSize / (1024 * 1024)}MB limit`);
    }

    // Check file type
    if (!config.settings.allowedFileTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only PDF, JPEG, and PNG are allowed');
    }

    // Create upload directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Generate unique filename
    const fileExt = path.extname(file.originalname);
    const filename = `${Date.now()}${fileExt}`;
    const filePath = path.join(uploadPath, filename);

    // Move file to upload directory
    await fs.promises.rename(file.path, filePath);

    return {
      success: true,
      filename,
      path: filePath,
      url: `/uploads/${filename}`
    };
  } catch (error) {
    // Clean up the temporary file if upload fails
    if (file && file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  logInfo,
  logError,
  validateEmail,
  validatePhone,
  generatePassword,
  formatEthiopianDate,
  handleFileUpload
};