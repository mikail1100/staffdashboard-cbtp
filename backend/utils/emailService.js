const nodemailer = require('nodemailer');
const config = require('../config/config');
const { logError, logInfo } = require('./helpers');

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure, // true for 465, false for other ports
  auth: {
    user: config.email.user,
    pass: config.email.password
  }
});

/**
 * Send email with the given options
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} [options.text] - Plain text body
 * @param {string} [options.html] - HTML body
 * @returns {Promise<Object>} - Result of sending email
 */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    if (!to || !subject || (!text && !html)) {
      throw new Error('Missing required email parameters');
    }

    const mailOptions = {
      from: config.email.from,
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    logInfo(`Email sent to ${to} with subject "${subject}"`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logError(`Failed to send email to ${to}: ${error.message}`);
    return { 
      success: false, 
      error: error.message,
      details: error 
    };
  }
};

/**
 * Send email template for request status updates
 * @param {Object} params
 * @param {string} params.to - Recipient email
 * @param {string} params.name - Recipient name
 * @param {string} params.serviceType - Type of service requested
 * @param {string} params.status - New status (approved/rejected/completed)
 * @param {string} [params.reason] - Reason for rejection (if applicable)
 * @param {Date} [params.appointmentDate] - Appointment date (if applicable)
 * @returns {Promise<Object>} - Result of sending email
 */
const sendStatusEmail = async ({ 
  to, 
  name, 
  serviceType, 
  status, 
  reason, 
  appointmentDate 
}) => {
  let subject, text;

  switch (status.toLowerCase()) {
    case 'approved':
      subject = `Your ${serviceType} Request Has Been Approved`;
      text = `Dear ${name},\n\nYour request for ${serviceType} has been approved.\n\n` +
             `Appointment Date: ${appointmentDate}\n\n` +
             `Please come to the kebele office at the scheduled time.\n\nThank you.`;
      break;
    case 'rejected':
      subject = `Your ${serviceType} Request Has Been Rejected`;
      text = `Dear ${name},\n\nYour request for ${serviceType} has been rejected.\n\n` +
             `Reason: ${reason}\n\n` +
             `Please correct the issues and resubmit your application.\n\nThank you.`;
      break;
    case 'completed':
      subject = `Your ${serviceType} Request Has Been Completed`;
      text = `Dear ${name},\n\nYour request for ${serviceType} has been completed.\n\n` +
             `Thank you for using our services.`;
      break;
    default:
      throw new Error('Invalid status provided for email template');
  }

  return sendEmail({ to, subject, text });
};

/**
 * Send account credentials email
 * @param {Object} params
 * @param {string} params.to - Recipient email
 * @param {string} params.name - Recipient name
 * @param {string} params.email - Account email
 * @param {string} params.password - Account password
 * @param {string} params.role - Account role (resident/staff)
 * @returns {Promise<Object>} - Result of sending email
 */
const sendCredentialsEmail = async ({ 
  to, 
  name, 
  email, 
  password, 
  role 
}) => {
  const subject = `Your Kebele ${role.charAt(0).toUpperCase() + role.slice(1)} Account`;
  const text = `Dear ${name},\n\nYour ${role} account has been created.\n\n` +
               `Email: ${email}\nPassword: ${password}\n\n` +
               `Please change your password after first login.\n\nThank you.`;

  return sendEmail({ to, subject, text });
};

module.exports = {
  sendEmail,
  sendStatusEmail,
  sendCredentialsEmail,
  transporter
};