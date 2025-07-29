// lib/backend/controllers/cleanupController.js

const EducationContent   = require('../models/EducationContent');
const asyncHandler       = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
const path               = require('path');
const Cleanup            = require('../models/Cleanup');
const User               = require('../models/User');
const { sendEmail }      = require('../services/emailService');
const { awardBadge, addPoints } = require('../services/badgeService');
const makePublicUrl      = require('../utils/publicUrl');  // ← helper to build reachable URLs

/**
 * POST /api/cleanup
 * Create a new cleanup request.
 */
exports.createCleanupRequest = asyncHandler(async (req, res) => {
  const {
    title, description, location,
    wasteType, severity, scheduledDate,
    latitude, longitude
  } = req.body;

  if (latitude == null || longitude == null) {
    return res.status(400).json({ msg: 'latitude & longitude waa loo baahan yahay' });
  }
  if (!req.files || !req.files.length) {
    return res.status(400).json({ msg: 'Fadlan sawir hal sawir ugu yaraan soo geli.' });
  }

  // Build public URLs for all uploaded photos
  const photos = req.files.map(f =>
    makePublicUrl(req, path.basename(f.filename))
  );

  const newCleanup = new Cleanup({
    createdBy:   req.user.id,
    title,
    description,
    location,
    wasteType,
    severity,
    scheduledDate,
    latitude:    parseFloat(latitude),
    longitude:   parseFloat(longitude),
    photos,
    beforeImages: photos,
    status:      'pending',
    volunteers:  []
  });

  await newCleanup.save();
  await newCleanup.populate('createdBy', 'fullName');

  // Award for first-ever cleanup request
  const count = await Cleanup.countDocuments({ createdBy: req.user.id });
  if (count === 1) {
    await awardBadge(req.user.id, 'First Cleanup Requested', '📢');
    await addPoints(req.user.id, 15);
  }

  res.status(201).json(newCleanup);
});

/**
 * GET /api/cleanup/mine
 */
exports.getOwnCleanupRequests = asyncHandler(async (req, res) => {
  const mine = await Cleanup.find({ createdBy: req.user.id })
    .sort({ createdAt: -1 })
    .populate('createdBy', 'fullName')
    .populate('volunteers', 'fullName');
  res.json(mine);
});

/**
 * GET /api/admin/cleanups
 */
exports.getAllCleanupRequests = asyncHandler(async (req, res) => {
  const all = await Cleanup.find()
    .sort({ createdAt: -1 })
    .populate('createdBy', 'fullName')
    .populate('volunteers', 'fullName');
  res.json(all);
});

/**
 * GET /api/admin/cleanups/:id
 */
exports.getCleanupById = asyncHandler(async (req, res) => {
  const c = await Cleanup.findById(req.params.id)
    .populate('createdBy', 'fullName')
    .populate('volunteers', 'fullName');
  if (!c) return res.status(404).json({ msg: 'Cleanup not found' });
  res.json(c);
});

/**
 * PUT /api/admin/cleanups/:id/approve
 */
exports.approveCleanupRequest = asyncHandler(async (req, res) => {
  const updated = await Cleanup.findByIdAndUpdate(
    req.params.id,
    { status: 'approved' },
    { new: true }
  )
    .populate('createdBy', 'fullName email')
    .populate('volunteers', 'fullName email');

  if (!updated) return res.status(404).json({ msg: 'Cleanup not found' });

  // notify creator
  await sendEmail(
    updated.createdBy.email,
    `Cleanup “${updated.title}” Approved`,
    `<p>Hi ${updated.createdBy.fullName}, your cleanup request “${updated.title}” has been approved.</p>`
  );

  // badge & points
  await awardBadge(updated.createdBy._id, 'Cleanup Approved', '✅');
  await addPoints(updated.createdBy._id, 25);

  res.json(updated);
});

/**
 * PUT /api/admin/cleanups/:id/reject
 */
exports.rejectCleanupRequest = asyncHandler(async (req, res) => {
  const updated = await Cleanup.findByIdAndUpdate(
    req.params.id,
    { status: 'rejected' },
    { new: true }
  )
    .populate('createdBy', 'fullName email')
    .populate('volunteers', 'fullName email');

  if (!updated) return res.status(404).json({ msg: 'Cleanup not found' });

  // notify creator
  await sendEmail(
    updated.createdBy.email,
    `Cleanup “${updated.title}” Rejected`,
    `<p>Hi ${updated.createdBy.fullName}, we're sorry but your cleanup request “${updated.title}” was rejected.</p>`
  );

  // badge & points
  await awardBadge(updated.createdBy._id, 'Cleanup Rejected', '❌');
  await addPoints(updated.createdBy._id, 5);

  res.json(updated);
});

/**
 * PUT /api/admin/cleanups/:id
 */
exports.updateCleanupRequest = asyncHandler(async (req, res) => {
  const fields = {
    title:       req.body.title,
    description: req.body.description,
    location:    req.body.location,
    wasteType:   req.body.wasteType,
    severity:    req.body.severity,
  };

  if (req.body.scheduledDate) {
    fields.scheduledDate = new Date(req.body.scheduledDate);
  }
  if (req.body.latitude) {
    fields.latitude = parseFloat(req.body.latitude);
  }
  if (req.body.longitude) {
    fields.longitude = parseFloat(req.body.longitude);
  }

  // If new photos were uploaded, rebuild their URLs
  if (req.files && req.files.length) {
    fields.photos = req.files.map(f =>
      makePublicUrl(req, path.basename(f.filename))
    );
    if (!req.body.beforeImages?.length) {
      fields.beforeImages = fields.photos;
    }
  }

  if (req.body.status) {
    fields.status = req.body.status;
  }

  const updateOps = { ...fields };
  if (req.body.volunteers) {
    const newVols = Array.isArray(req.body.volunteers)
      ? req.body.volunteers
      : JSON.parse(req.body.volunteers);
    updateOps.$set = {
      volunteers: Array.from(new Set(newVols.map(String)))
    };
  }

  const updated = await Cleanup.findByIdAndUpdate(
    req.params.id,
    updateOps,
    { new: true }
  )
    .populate('createdBy', 'fullName email')
    .populate('volunteers', 'fullName email');

  if (!updated) return res.status(404).json({ msg: 'Cleanup not found' });
  res.json(updated);
});

/**
 * PUT /api/admin/cleanups/:id/schedule
 */
exports.scheduleCleanup = asyncHandler(async (req, res) => {
  const { scheduledDate } = req.body;
  if (!scheduledDate) {
    return res.status(400).json({ msg: 'scheduledDate is required' });
  }

  const updated = await Cleanup.findByIdAndUpdate(
    req.params.id,
    { scheduledDate: new Date(scheduledDate), status: 'scheduled' },
    { new: true }
  )
    .populate('createdBy', 'fullName')
    .populate('volunteers', 'fullName email');

  if (!updated) return res.status(404).json({ msg: 'Cleanup not found' });

  await Promise.all(updated.volunteers.map(u =>
    sendEmail(
      u.email,
      `Scheduled: “${updated.title}”`,
      `<p>Hi ${u.fullName}, the cleanup “${updated.title}” is now scheduled for ${new Date(updated.scheduledDate).toLocaleString()}.</p>`
    )
  ));

  res.json(updated);
});

/**
 * PUT /api/admin/cleanups/:id/complete
 */
exports.completeCleanup = asyncHandler(async (req, res) => {
  const updated = await Cleanup.findByIdAndUpdate(
    req.params.id,
    { status: 'completed' },
    { new: true }
  )
    .populate('createdBy', 'fullName email')
    .populate('volunteers', 'fullName email');

  if (!updated) return res.status(404).json({ msg: 'Cleanup not found' });

  await Promise.all(updated.volunteers.map(v => addPoints(v._id, 10)));
  await addPoints(updated.createdBy._id, 30);

  const compCount = await Cleanup.countDocuments({
    createdBy: updated.createdBy._id,
    status: 'completed'
  });
  if (compCount === 1) {
    await awardBadge(updated.createdBy._id, 'First Cleanup Completed', '🏆');
  }

  res.json(updated);
});

/**
 * PUT /api/cleanup/:id/finish
 */
exports.finishCleanup = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!req.files?.afterImages?.length) {
    return res.status(400).json({ msg: 'Ugu yaraan hal sawir “after” ah soo geli.' });
  }

  const cleanup = await Cleanup.findById(id);
  if (!cleanup) {
    return res.status(404).json({ msg: 'Cleanup not found' });
  }
  if (cleanup.createdBy.toString() !== req.user.id) {
    return res.status(403).json({ msg: 'Not authorised' });
  }

  // Build public URLs for the after‐images
  const after = req.files.afterImages.map(f =>
    makePublicUrl(req, path.basename(f.filename))
  );

  cleanup.afterImages = after;
  cleanup.status      = 'completed';
  await cleanup.save();

  await addPoints(req.user.id, 30);
  const firstCompleted = await Cleanup.countDocuments({
    createdBy: req.user.id,
    status: 'completed'
  }) === 1;
  if (firstCompleted) {
    await awardBadge(req.user.id, 'First Cleanup Completed', '🏆');
  }

  // Auto‐publish side‑by‑side comparison in Education
  await EducationContent.create({
    title:        `Cleanup completed: ${cleanup.title}`,
    description:  cleanup.description || '',
    kind:         'comparison',
    beforeImages: cleanup.beforeImages.length ? cleanup.beforeImages : cleanup.photos,
    afterImages:  after,
    uploadedBy:   req.user.id,
    cleanupId:    cleanup._id,
  });

  res.json(cleanup);
});

/**
 * GET /api/cleanup/:id/volunteers
 */
exports.getCleanupVolunteers = asyncHandler(async (req, res) => {
  const c = await Cleanup.findById(req.params.id)
    .populate('volunteers', 'fullName profilePicture');
  if (!c) return res.status(404).json({ msg: 'Cleanup not found' });
  res.json(c.volunteers);
});

/**
 * POST /api/cleanup/:id/volunteer
 */
exports.joinCleanup = asyncHandler(async (req, res) => {
  const cleanupId = req.params.id;
  const userId    = req.user.id;

  const updated = await Cleanup.findByIdAndUpdate(
    cleanupId,
    { $addToSet: { volunteers: userId } },
    { new: true }
  )
    .populate('createdBy', 'fullName')
    .populate('volunteers', 'fullName profilePicture');

  if (!updated) return res.status(404).json({ msg: 'Cleanup not found' });

  const volCount = await Cleanup.countDocuments({ volunteers: userId });
  if (volCount === 1) {
    await awardBadge(userId, 'First Volunteer', '🤝');
    await addPoints(userId, 20);
  } else {
    await addPoints(userId, 5);
  }

  res.json(updated.volunteers);
});

/**
 * DELETE /api/cleanup/:id/volunteer
 */
exports.leaveCleanup = asyncHandler(async (req, res) => {
  const cleanupId = req.params.id;
  const userId    = req.user.id;

  const updated = await Cleanup.findByIdAndUpdate(
    cleanupId,
    { $pull: { volunteers: userId } },
    { new: true }
  )
    .populate('volunteers', 'fullName profilePicture');

  if (!updated) return res.status(404).json({ msg: 'Cleanup not found' });
  res.json(updated.volunteers);
});

/**
 * GET /api/cleanup
 * Public list of approved, scheduled, or completed cleanups.
 */
exports.listPublicCleanups = asyncHandler(async (_req, res) => {
  const list = await Cleanup.find({
    status: { $in: ['approved', 'scheduled', 'completed'] },
  })
    .sort({ createdAt: -1 })
    .populate('createdBy',  'fullName profilePicture')
    .populate('volunteers', 'fullName profilePicture')
    .lean();

  res.set('Cache-Control', 'no-store, max-age=0');
  res.json(list);
});

/**
 * GET /api/cleanup/:id
 * Public detail including volunteers.
 */
exports.getCleanupPublicById = asyncHandler(async (req, res) => {
  const c = await Cleanup.findById(req.params.id)
    .populate('createdBy',  'fullName profilePicture')
    .populate('volunteers', 'fullName profilePicture email')
    .lean();

  if (!c) return res.status(404).json({ msg: 'Cleanup not found' });
  res.set('Cache-Control', 'no-store, max-age=0');
  res.json(c);
});
