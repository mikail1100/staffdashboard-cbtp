const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'staff', 'admin'],
    default: 'user'
  },
  userId: {
    type: String,
    unique: true
  },
  personalInfo: {
    fatherName: String,
    grandfatherName: String,
    placeOfBirth: String,
    region: String,
    zone: String,
    woreda: String,
    houseNo: String,
    phoneNumber: String,
    dateOfBirth: Date,
    gender: String,
    nationality: String,
    motherFullName: String,
    motherNationality: String,
    fatherFullName: String,
    fatherNationality: String
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
