const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    enum: ['birth', 'death', 'marriage', 'divorce', 'adoption'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  formData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  documents: [{
    filename: String,
    originalName: String,
    path: String,
    mimetype: String
  }],
  rejectionReason: String,
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  appointment: {
    date: Date,
    time: String,
    location: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  processedAt: Date
});

module.exports = mongoose.model('Request', requestSchema);
