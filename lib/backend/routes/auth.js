// routes/auth.js
const router = require('express').Router();
const {
  register,
  verifyRegister,
  login,
  forgotPassword,
  verifyForgotOtp,
  resetPasswordWithOtp,
  resetPasswordByToken, // optional, if keeping link-based reset
} = require('../controllers/authController');

console.log('[INIT] auth router loaded');

router.post('/register',         (req, res, next) => { console.log('[ROUTE] /register'); register(req, res, next); });
router.post('/verify-register',  (req, res, next) => { console.log('[ROUTE] /verify-register'); verifyRegister(req, res, next); });
router.post('/login',            (req, res, next) => { console.log('[ROUTE] /login'); login(req, res, next); });

router.post('/forgot-password',   (req, res, next) => { console.log('[ROUTE] /forgot-password'); forgotPassword(req, res, next); });
router.post('/verify-forgot-otp', (req, res, next) => { console.log('[ROUTE] /verify-forgot-otp'); verifyForgotOtp(req, res, next); });
router.post('/reset-password',    (req, res, next) => { console.log('[ROUTE] /reset-password'); resetPasswordWithOtp(req, res, next); });

// Optional: link/token-based reset
router.post('/reset/:token',      (req, res, next) => { console.log('[ROUTE] /reset/:token'); resetPasswordByToken(req, res, next); });

module.exports = router;
