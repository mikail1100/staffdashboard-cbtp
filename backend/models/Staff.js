// models/Staff.js
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: 'staff'
  }
});

module.exports = mongoose.model('Staff', staffSchema);
