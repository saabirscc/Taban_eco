// lib/backend/routes/cleanup.js

const express       = require('express');
const path          = require('path');
const multer        = require('multer');
const Cleanup       = require('../models/Cleanup');
const asyncHandler  = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const {
  createCleanupRequest,
  getOwnCleanupRequests,
  getAllCleanupRequests,
  getCleanupById,
  updateCleanupRequest,
  approveCleanupRequest,
  rejectCleanupRequest,
  scheduleCleanup,
  completeCleanup,
  finishCleanup,            // ← your new handler
  getCleanupVolunteers,
  joinCleanup,
  leaveCleanup,
  listPublicCleanups,
  getCleanupPublicById,
} = require('../controllers/cleanupController');

const { authenticate, authorizeRole } = require('../middlewares/auth');

/* -------- Multer setup -------- */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename:   (_req, file, cb) => cb(null, `cleanup-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

/* -------- No‑cache middleware -------- */
const noCache = (_req, res, next) => {
  res.set('Cache-Control', 'no-store, max-age=0');
  next();
};

/* ================== PUBLIC (NO TOKEN) ================== */
const publicRouter = express.Router();
publicRouter.get('/',     noCache, listPublicCleanups);
publicRouter.get('/:id',  noCache, getCleanupPublicById);

/* ================== USER (TOKEN REQUIRED) ================== */
const userRouter = express.Router();

// Create a new cleanup request
userRouter.post(
  '/',
  authenticate,
  upload.array('photos', 6),
  createCleanupRequest
);

// List own cleanup requests
userRouter.get(
  '/mine',
  authenticate,
  noCache,
  getOwnCleanupRequests
);

// Join/leave volunteer
userRouter.get(
  '/:id/volunteers',
  authenticate,
  noCache,
  getCleanupVolunteers
);
userRouter.post(
  '/:id/volunteer',
  authenticate,
  noCache,
  joinCleanup
);
userRouter.delete(
  '/:id/volunteer',
  authenticate,
  noCache,
  leaveCleanup
);

// Finish and upload "after" images (creator only)
userRouter.put(
  '/:id/finish',
  authenticate,
  upload.fields([{ name: 'afterImages', maxCount: 6 }]),
  finishCleanup
);

/* ================== ADMIN (TOKEN + ROLE) ================== */
const adminRouter = express.Router();
adminRouter.use(authenticate, authorizeRole('Admin'));

adminRouter.get(
  '/',
  noCache,
  getAllCleanupRequests
);
adminRouter.get(
  '/:id',
  noCache,
  getCleanupById
);
adminRouter.put(
  '/:id',
  upload.array('photos', 6),
  noCache,
  updateCleanupRequest
);
adminRouter.put(
  '/:id/approve',
  noCache,
  approveCleanupRequest
);
adminRouter.put(
  '/:id/reject',
  noCache,
  rejectCleanupRequest
);
adminRouter.put(
  '/:id/schedule',
  upload.none(),
  noCache,
  scheduleCleanup
);
adminRouter.put(
  '/:id/complete',
  upload.none(),
  noCache,
  completeCleanup
);

// Optional: admin upload before & after comparison images
adminRouter.put(
  '/:id/before-after-images',
  upload.fields([
    { name: 'beforeImages', maxCount: 6 },
    { name: 'afterImages',  maxCount: 6 },
  ]),
  noCache,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const cleanup = await Cleanup.findById(id);
    if (!cleanup) return res.status(404).json({ msg: 'Cleanup not found' });

    const before = req.files.beforeImages?.map(f => `/uploads/${f.filename}`) || [];
    const after  = req.files.afterImages?.map(f => `/uploads/${f.filename}`) || [];

    if (before.length) cleanup.beforeImages = before;
    if (after.length)  cleanup.afterImages  = after;

    await cleanup.save();
    res.json(cleanup);
  })
);

module.exports = {
  publicCleanupRouter: publicRouter,
  userCleanupRouter:   userRouter,
  adminCleanupRouter:  adminRouter,
};
