const Reward = require('../models/Reward');

exports.assignReward = async (req, res) => {
  const { userId, badgeName, icon } = req.body;
  const newReward = new Reward({ user: userId, badgeName, icon });
  await newReward.save();
  res.status(201).json(newReward);
};

exports.getUserRewards = async (req, res) => {
  const rewards = await Reward.find({ user: req.params.userId });
  res.json(rewards);
};
