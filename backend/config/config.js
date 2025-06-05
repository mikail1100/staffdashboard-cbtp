const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  // Application configuration
  app: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
    name: 'Kebele Management System',
  },

  // Database configuration
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/kebele_management',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
  },

  // Authentication configuration
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@kebele.gov.et',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  },

  // Email configuration
  email: {
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER || 'your_email@example.com',
    password: process.env.EMAIL_PASSWORD || 'your_email_password',
    from: process.env.EMAIL_FROM || '"Kebele Management" <noreply@kebele.gov.et>',
  },

  // Application settings
  settings: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    defaultNationality: 'Ethiopia',
    defaultCountry: 'Ethiopia',
  },

  // Response messages
  messages: {
    invalidCredentials: 'Invalid email or password',
    accessDenied: 'Access denied. You are not authorized to perform this action',
    notFound: 'Resource not found',
    serverError: 'Internal server error',
    emailSent: 'Email sent successfully',
    validationError: 'Validation error',
  },
};