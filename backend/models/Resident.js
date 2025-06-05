// models/Resident.js
const mongoose = require('mongoose');

const residentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  kebeleId: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String
  },
  email: {
    type: String
  },
  address: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resident', residentSchema);
