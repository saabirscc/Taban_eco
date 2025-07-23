const express = require('express');
const router  = express.Router();
const { authenticate, authorizeRole } = require('../middlewares/auth');
const { assignReward, getUserRewards } = require('../controllers/rewardController');

// Give a reward (admin only)
router.post(
  '/',
  authenticate,
  authorizeRole('Admin'),
  assignReward
);

// List rewards for a user (the user themself or admin)
router.get(
  '/:userId',
  authenticate,
  // optionally only allow self or admin:
  (req, res, next) => {
    if (req.user.role === 'Admin' || req.user.id === req.params.userId) {
      return next();
    }
    return res.status(403).json({ msg: 'Forbidden' });
  },
  getUserRewards
);

module.exports = router;
