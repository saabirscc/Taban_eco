const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  badgeName: String,
  icon: String,
  earnedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reward', rewardSchema);
