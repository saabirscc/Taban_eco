// lib/backend/controllers/reportController.js

const Cleanup  = require('../models/Cleanup');
const Feedback = require('../models/Feedback');
const User     = require('../models/User');

/**
 * Participation report: number of cleanups & feedbacks per week/month
 */
exports.participation = async (req, res, next) => {
  try {
    // aggregate by month for cleanups
    const cleanupsByMonth = await Cleanup.aggregate([
      { $match: { status: { $in: ['approved','completed'] } } },
      { $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    // aggregate by month for feedback
    const feedbackByMonth = await Feedback.aggregate([
      { $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    res.json({ cleanupsByMonth, feedbackByMonth });
  } catch (err) {
    next(err);
  }
};

/**
 * Waste type analysis: count of cleanups per wasteType
 */
exports.wasteAnalysis = async (req, res, next) => {
  try {
    const byType = await Cleanup.aggregate([
      { $group: {
          _id: '$wasteType',
          count: { $sum: 1 }
      }},
      { $sort: { count: -1 } }
    ]);
    res.json(byType);
  } catch (err) {
    next(err);
  }
};

/**
 * District-wise performance: number of cleanups & feedback per district
 */
exports.districtPerformance = async (req, res, next) => {
  try {
    // cleanups
    const cleanups = await Cleanup.aggregate([
      { $group: {
          _id: '$location.district', // or wherever you store district
          count: { $sum: 1 }
      }},
      { $sort: { count: -1 } }
    ]);

    // feedback by district (via user → district)
    const feedback = await Feedback.aggregate([
      { $lookup: {
          from: 'users',
          localField: 'submittedBy',
          foreignField: '_id',
          as: 'user'
      }},
      { $unwind: '$user' },
      { $group: {
          _id: '$user.district',
          count: { $sum: 1 }
      }},
      { $sort: { count: -1 } }
    ]);

    res.json({ cleanups, feedback });
  } catch (err) {
    next(err);
  }
};
