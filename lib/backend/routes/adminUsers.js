// lib/backend/routes/adminUsers.js

const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
} = require('../controllers/userController');

const { authenticate, authorizeRole } = require('../middlewares/auth');

// All routes here require Admin:
// router.use(authenticate, authorizeRole('Admin'));

// GET /api/admin/users
router.get('/', getAllUsers);

// GET /api/admin/users/:id
router.get('/:id', getUserById);

// POST /api/admin/users
router.post('/', createUser);

// PUT /api/admin/users/:id
router.put('/:id', updateUserById);

// DELETE /api/admin/users/:id
router.delete('/:id', deleteUserById);

module.exports = router;
