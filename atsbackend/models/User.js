const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
  role: { type: String, required: true, enum: ['Candidate', 'Manager'] },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  city: { type: String, required: true },
  highestEducationLevel: {
      type: String,
      required: true,
      enum: ['Baccalaureate', 'Licence', 'Engineering']
  },
  gender: { type: String, required: true, enum: ['male', 'female'] }, // Add this line
  resetCode: { type: String },
  resetCodeExpires: { type: Date },
  verificationCode: String,
  isVerified: { type: Boolean, default: false }
});

// Create User model
const User = mongoose.model('User', userSchema);

module.exports = User;