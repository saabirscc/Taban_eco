// services/badgeService.js
const User   = require('../models/User');
const Reward = require('../models/Reward');

async function addPoints(userId, pts) {
  const u = await User.findById(userId);
  if (!u) throw new Error('User not found');
  u.points += pts;
  await u.save();
}

// only award once
async function awardBadge(userId, badgeName, icon) {
  const u = await User.findById(userId);
  if (!u) throw new Error('User not found');
  if (u.badges.some(b=>b.name===badgeName)) return;
  u.badges.push({ name: badgeName, dateEarned: new Date(), icon });
  await u.save();
}

module.exports = { addPoints, awardBadge };
