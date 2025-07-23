/**
 * Routes that let a logged-in user view / edit **their own** profile.
 * (Admin-level CRUD lives in routes/adminUsers.js)
 */
const router = require('express').Router();
const { authenticate } = require('../middlewares/auth');
const multer   = require('../config/multer');   //
const {
  getProfile,
  updateProfile,
  uploadAvatar,
} = require('../controllers/userController');

// GET  /api/users/me
router.get('/me', authenticate, getProfile);

// PUT  /api/users/me
router.put('/me', authenticate, updateProfile);
router.post(
  '/me/avatar',
  authenticate,
  multer.single('avatar'), // field name must match Flutter side
  uploadAvatar
);
module.exports = router;
