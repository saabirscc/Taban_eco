// controllers/authController.js

const User               = require('../models/User');
const bcrypt             = require('bcryptjs');
const jwt                = require('jsonwebtoken');
const crypto             = require('crypto');
const { sendEmail }      = require('../services/emailService');
const { awardBadge, addPoints } = require('../services/badgeService');
const FRONTEND_URL       = process.env.FRONTEND_URL || 'http://localhost:3000';

/**
 * Helper to wrap async controllers and forward errors to Express.
 */
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ──────────────────────────────────────────────────────────────
 *  REGISTER – Step 1: Send OTP
 *  POST /api/auth/register
 * ────────────────────────────────────────────────────────────*/
exports.register = asyncHandler(async (req, res) => {
  const { fullName, email, password, district, phoneNumber } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ msg: 'fullName, email, and password are required' });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    if (!existingUser.isVerified) {
      // Resend OTP
      const otp = existingUser.generateEmailVerificationOtp();
      await existingUser.save();
      await sendEmail(
        email,
        'Verify your email',
        `<p>Your verification code is <strong>${otp}</strong> (expires in 10 min)</p>`
      );
      return res.status(200).json({ msg: 'OTP resent to email for verification' });
    }
    return res.status(400).json({ msg: 'User already exists and is verified' });
  }

  // Create new user (unverified)
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    fullName,
    email: email.toLowerCase(),
    password: hashedPassword,
    district,
    phoneNumber,
    isVerified: false,
  });

  const otp = user.generateEmailVerificationOtp();
  await user.save();

  await sendEmail(
    email,
    'Verify your email',
    `<p>Welcome, ${fullName}! Your verification code is <strong>${otp}</strong> (expires in 10 min)</p>`
  );
  res.status(201).json({ msg: 'OTP sent to email for verification' });
});

/* ──────────────────────────────────────────────────────────────
 *  REGISTER – Step 2: Verify OTP
 *  POST /api/auth/verify-register
 * ────────────────────────────────────────────────────────────*/
exports.verifyRegister = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ msg: 'Email and OTP are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user)               return res.status(404).json({ msg: 'User not found' });
  if (user.isVerified)     return res.status(400).json({ msg: 'User already verified' });
  if (!user.verifyEmailOtp(otp)) {
    return res.status(400).json({ msg: 'Invalid or expired OTP' });
  }

  user.isVerified = true;
  user.clearEmailVerificationOtp();
  await user.save();

  // Reward: badge + points
  await awardBadge(user._id, 'Verified Account', '✅');
  await addPoints(user._id, 20);

  res.json({ msg: 'Email verified, registration complete' });
});

/* ──────────────────────────────────────────────────────────────
 *  LOGIN
 *  POST /api/auth/login
 * ────────────────────────────────────────────────────────────*/
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user)                 return res.status(400).json({ msg: 'Invalid credentials' });
  if (!user.isVerified)      return res.status(403).json({ msg: 'Email not verified. Please verify your email first.' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok)                   return res.status(400).json({ msg: 'Invalid credentials' });

  user.lastLogin = Date.now();
  await user.save().catch(() => {});

  const token = jwt.sign(
    { user: { id: user._id, role: user.role } },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  // 🚀 NEW: return the **full** profile (minus password)
  const userObj = user.toObject();
  delete userObj.password;

  res.json({ token, user: userObj });
});

/* ──────────────────────────────────────────────────────────────
 *  FORGOT PASSWORD – Step 1: Request OTP
 *  POST /api/auth/forgot-password
 * ────────────────────────────────────────────────────────────*/
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: 'Email is required' });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (user) {
    const otp = user.generatePasswordResetOtp();
    await user.save();
    await sendEmail(
      email,
      'Password Reset Code',
      `<p>Your reset code is <strong>${otp}</strong> (expires in 10 min)</p>`
    );
  }

  // Always succeed (prevents email enumeration)
  res.json({ msg: 'If that email exists, an OTP has been sent to reset password' });
});

/* ──────────────────────────────────────────────────────────────
 *  FORGOT PASSWORD – Step 2: Verify OTP
 *  POST /api/auth/verify-forgot-otp
 * ────────────────────────────────────────────────────────────*/
exports.verifyForgotOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ msg: 'Email and OTP are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user)                     return res.status(404).json({ msg: 'User not found' });
  if (!user.verifyPasswordResetOtp(otp)) {
    return res.status(400).json({ msg: 'Invalid or expired OTP' });
  }

  res.json({ msg: 'OTP verified. You may now reset your password.' });
});

/* ──────────────────────────────────────────────────────────────
 *  RESET PASSWORD – Step 3: Reset with OTP
 *  POST /api/auth/reset-password
 * ────────────────────────────────────────────────────────────*/
exports.resetPasswordWithOtp = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ msg: 'Email, OTP, and newPassword are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user)                     return res.status(404).json({ msg: 'User not found' });
  if (!user.verifyPasswordResetOtp(otp)) {
    return res.status(400).json({ msg: 'Invalid or expired OTP' });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.clearPasswordResetOtp();
  await user.save();

  res.json({ msg: 'Password has been reset successfully' });
});

/* ──────────────────────────────────────────────────────────────
 *  OPTIONAL: Link‑based reset (token in URL)
 *  POST /api/auth/reset/:token
 * ────────────────────────────────────────────────────────────*/
exports.resetPasswordByToken = asyncHandler(async (req, res) => {
  const { token }    = req.params;
  const { password } = req.body;
  if (!password) return res.status(400).json({ msg: 'New password is required' });

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetToken:   hashedToken,
    resetExpires: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ msg: 'Token invalid or expired' });

  user.password     = await bcrypt.hash(password, 10);
  user.resetToken   = undefined;
  user.resetExpires = undefined;
  await user.save();

  res.json({ msg: 'Password updated successfully' });
});
