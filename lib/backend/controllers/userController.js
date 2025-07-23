// lib/backend/controllers/userController.js

const User = require('../models/User');
const { awardBadge, addPoints } = require('../services/badgeService');

/**
 * GET /api/users/me
 * Return the current user’s profile (minus password).
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('[getProfile ERR]', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * PUT /api/users/me
 * Let the user update their own profile.
 * Awards a badge & points once when they add a phoneNumber for the first time.
 */
exports.updateProfile = async (req, res) => {
  try {
    // fetch "before" so we can detect phoneNumber addition
    const before = await User.findById(req.user.id);

    // strip out protected fields
    const updates = { ...req.body };
    delete updates.role;
    delete updates.isVerified;
    delete updates.password;

    // perform the update
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    // if they had no phoneNumber before but added one now, award
    if (!before.phoneNumber && updatedUser.phoneNumber) {
      await awardBadge(req.user.id, 'Profile Completed', '📝');
      await addPoints(req.user.id, 10);
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('[updateProfile ERR]', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

/* ---------- Admin-only user CRUD below ---------- */

/**
 * GET /api/admin/users
 * List all users (minus passwords).
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('[getAllUsers ERR]', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * GET /api/admin/users/:id
 * Get a single user by ID.
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('[getUserById ERR]', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * POST /api/admin/users
 * Create a new user (admin).
 */
exports.createUser = async (req, res) => {
  try {
    const { fullName, email, password, district, phoneNumber, role = 'Users' } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ msg: 'fullName, email, and password are required' });
    }

    // ensure unique email
    if (await User.exists({ email: email.toLowerCase() })) {
      return res.status(400).json({ msg: 'User with that email already exists' });
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      district,
      phoneNumber,
      role,
      isVerified: true
    });
    await newUser.save();

    const out = newUser.toObject();
    delete out.password;
    res.status(201).json(out);
  } catch (err) {
    console.error('[createUser ERR]', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * PUT /api/admin/users/:id
 * Update any user by ID (admin).
 */
exports.updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = { ...req.body };

    // email uniqueness
    if (updates.email) {
      const exists = await User.findOne({
        email: updates.email.toLowerCase(),
        _id: { $ne: userId }
      });
      if (exists) {
        return res.status(400).json({ msg: 'Another user with that email already exists' });
      }
      updates.email = updates.email.toLowerCase();
    }

    // hash password if present
    if (updates.password) {
      const bcrypt = require('bcryptjs');
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    console.error('[updateUserById ERR]', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * DELETE /api/admin/users/:id
 * Delete a user by ID (admin).
 */
exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id === id) {
      return res.status(400).json({ msg: 'Cannot delete your own account' });
    }
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error('[deleteUserById ERR]', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
/* ───────────── POST  /api/users/me/avatar ───────────── */
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    // Build a public URL (e.g. http://192.168.1.12:5000/uploads/XXX.jpg)
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Save it on the logged‑in user
    const user = await User.findByIdAndUpdate(
      req.user.id,                       // populated by authenticate middleware
      { profilePicture: url },
      { new: true, select: '-password' } // don't send the hash back
    );

    res.json({ profilePicture: url, user });
  } catch (err) {
    next(err);
  }
};