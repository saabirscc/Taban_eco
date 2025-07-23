// lib/backend/controllers/cleanupController.js

const asyncHandler   = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const path          = require('path');
const Cleanup       = require('../models/Cleanup');
const User          = require('../models/User');
const { sendEmail } = require('../services/emailService');
const { awardBadge, addPoints } = require('../services/badgeService');

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

  const photos = req.files.map(f => {
    const filename = path.basename(f.filename);
    return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
  });

  const newCleanup = new Cleanup({
    createdBy:  req.user.id,
    title, description, location,
    wasteType, severity, scheduledDate,
    latitude:  parseFloat(latitude),
    longitude: parseFloat(longitude),
    photos,
    status:     'pending',
    volunteers: []
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
    title:         req.body.title,
    description:   req.body.description,
    location:      req.body.location,
    wasteType:     req.body.wasteType,
    severity:      req.body.severity,
    scheduledDate: req.body.scheduledDate,
    latitude:      parseFloat(req.body.latitude),
    longitude:     parseFloat(req.body.longitude),
  };

  if (req.files && req.files.length) {
    fields.photos = req.files.map(f => {
      const fn = path.basename(f.filename);
      return `${req.protocol}://${req.get('host')}/uploads/${fn}`;
    });
  }
  if (req.body.status) fields.status = req.body.status;

  const updateOps = { ...fields };

  // add volunteers without duplicates
  if (req.body.volunteers) {
    const newVols = Array.isArray(req.body.volunteers)
      ? req.body.volunteers
      : JSON.parse(req.body.volunteers);
    const deduped = Array.from(new Set(newVols.map(String)));
    updateOps.$set = { volunteers: deduped };
  }

  const updated = await Cleanup.findByIdAndUpdate(
    req.params.id,
    updateOps,
    { new: true }
  )
    .populate('createdBy', 'fullName email')
    .populate('volunteers', 'fullName email');

  if (!updated) return res.status(404).json({ msg: 'Cleanup not found' });

  // notify newly added volunteers
  if (updateOps.$set && updateOps.$set.volunteers) {
    const toNotify = await User.find({
      _id: { $in: updateOps.$set.volunteers }
    }).select('fullName email');

    await Promise.all(toNotify.map(u =>
      sendEmail(
        u.email,
        `Joined Cleanup “${updated.title}”`,
        `<p>Hi ${u.fullName}, you've joined the cleanup “${updated.title}”. Thanks for volunteering!</p>`
      )
    ));
  }

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

  // notify volunteers
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
 * Mark a cleanup as completed, award everyone points,
 * creator gets triple.
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

  // award volunteers: 10 points each
  await Promise.all(updated.volunteers.map(v =>
    addPoints(v._id, 10)
  ));

  // award creator: 30 points
  await addPoints(updated.createdBy._id, 30);

  // optionally badge creator first time completed
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
 * GET /api/cleanup/:id/volunteers
 */
exports.getCleanupVolunteers = asyncHandler(async (req, res) => {
  const c = await Cleanup.findById(req.params.id)
    .populate('volunteers', 'fullName profilePicture');
  if (!c) return res.status(404).json({ msg: 'Cleanup not found' });
  res.json(c.volunteers);
});

/**
 * POST  /api/cleanup/:id/volunteer
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

  // volunteer points: 20 first time, then 5
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
 * Public/user detail: include volunteers.
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