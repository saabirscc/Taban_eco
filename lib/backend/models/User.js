// models/User.js

const mongoose = require('mongoose');
const crypto = require('crypto');

const badgeSchema = new mongoose.Schema({
  name: String,
  dateEarned: Date,
  icon: String
});

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:    { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true },
  phoneNumber: String,
  age: Number,
  district: String,
  address: String,
  role: { type: String, enum: ['Admin', 'Users'], default: 'Users' },
  profilePicture: String,

  // Points, badges, etc.
  points: { type: Number, default: 0 },
  badges: [badgeSchema],
  cleanupsDone: { type: Number, default: 0 },

  // Email verification after registration
  isVerified: { type: Boolean, default: false },
  emailVerificationOtp: String,        // hashed OTP
  emailVerificationOtpExpires: Date,   // expiry datetime

  // Forgot password / reset password OTP
  passwordResetOtp: String,            // hashed OTP
  passwordResetOtpExpires: Date,       // expiry datetime
  // Optionally: number of failed attempts, etc.

  createdAt: { type: Date, default: Date.now },
  lastLogin: Date
});

// Instance method to generate OTP and set fields
userSchema.methods.generateEmailVerificationOtp = function() {
  // Generate a 6-digit numeric OTP. In production you might choose alphanumeric.
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // e.g. "345678"
  // Hash OTP before storing:
  const hashed = crypto.createHash('sha256').update(otp).digest('hex');
  this.emailVerificationOtp = hashed;
  // Expires in 10 minutes
  this.emailVerificationOtpExpires = Date.now() + 10 * 60 * 1000;
  return otp; // raw OTP to send via email
};

userSchema.methods.verifyEmailOtp = function(otp) {
  if (!this.emailVerificationOtp || !this.emailVerificationOtpExpires) return false;
  const now = Date.now();
  if (now > this.emailVerificationOtpExpires.getTime()) return false;
  const hashed = crypto.createHash('sha256').update(otp).digest('hex');
  return hashed === this.emailVerificationOtp;
};

userSchema.methods.clearEmailVerificationOtp = function() {
  this.emailVerificationOtp = undefined;
  this.emailVerificationOtpExpires = undefined;
};

userSchema.methods.generatePasswordResetOtp = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashed = crypto.createHash('sha256').update(otp).digest('hex');
  this.passwordResetOtp = hashed;
  this.passwordResetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return otp;
};

userSchema.methods.verifyPasswordResetOtp = function(otp) {
  if (!this.passwordResetOtp || !this.passwordResetOtpExpires) return false;
  const now = Date.now();
  if (now > this.passwordResetOtpExpires.getTime()) return false;
  const hashed = crypto.createHash('sha256').update(otp).digest('hex');
  return hashed === this.passwordResetOtp;
};

userSchema.methods.clearPasswordResetOtp = function() {
  this.passwordResetOtp = undefined;
  this.passwordResetOtpExpires = undefined;
};

module.exports = mongoose.model('User', userSchema);
