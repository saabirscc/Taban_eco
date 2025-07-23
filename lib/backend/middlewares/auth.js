// lib/backend/middlewares/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to verify JWT token in Authorization header.
 * If valid, attaches `req.user = { id, role }`.
 */
exports.authenticate = (req, res, next) => {
  const authHeader = req.header('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ msg: 'No token, access denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded.user should contain { id, role } by how you signed in login controller
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

/**
 * Middleware to authorize a specific role.
 * Usage: authorizeRole('Admin')
 */
exports.authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: 'Not authenticated' });
    }
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }
    next();
  };
};
