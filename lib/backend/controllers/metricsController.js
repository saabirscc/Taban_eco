// lib/backend/controllers/metricsController.js
const User             = require('../models/User');
const Cleanup          = require('../models/Cleanup');
const EducationContent = require('../models/EducationContent');
const Reward           = require('../models/Reward');
const Feedback         = require('../models/Feedback');

exports.getAdminMetrics = async (_req, res, next) => {
  try {
    const [
      userCount,
      cleanupCount,
      pendingCount,
      approvedCount,
      scheduledCount,
      completedCount,
      eduTotalCount,         // ALL education posts (video or image)
      eduVideoCount,         // optional breakdown
      eduImageCount,         // optional breakdown
      authorsIds,
      rewardsCount,          // each reward doc counts (3 for user A + 2 for user B = 5)
      feedbackCount,
    ] = await Promise.all([
      User.countDocuments({}),
      Cleanup.countDocuments({}),
      Cleanup.countDocuments({ status: 'pending' }),
      Cleanup.countDocuments({ status: 'approved' }),
      Cleanup.countDocuments({ status: 'scheduled' }),
      Cleanup.countDocuments({ status: 'completed' }),
      EducationContent.countDocuments({}),                 // <-- changed
      EducationContent.countDocuments({ kind: 'video' }),
      EducationContent.countDocuments({ kind: 'image' }),
      EducationContent.distinct('uploadedBy'),
      Reward.countDocuments({}),                           // <-- this already counts each reward
      Feedback.countDocuments({}),
    ]);

    res.set('Cache-Control', 'no-store, max-age=0');
    res.json({
      userCount,
      cleanupCount,
      pendingCount,
      approvedCount,
      scheduledCount,
      completedCount,
      eduTotalCount,
      eduVideoCount,
      eduImageCount,
      authorsCount: authorsIds.length,
      rewardsCount,
      feedbackCount,
    });
  } catch (err) {
    next(err);
  }
};
