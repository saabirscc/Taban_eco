// lib/backend/routes/cleanup.js
const express = require('express');
const path    = require('path');
const multer  = require('multer');
const asyncHandler = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);

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
  getCleanupVolunteers,
  joinCleanup,
  leaveCleanup,
  listPublicCleanups,
  getCleanupPublicById,
} = require('../controllers/cleanupController');

const { authenticate, authorizeRole } = require('../middlewares/auth');
const Cleanup = require('../models/Cleanup');

/* -------- Multer -------- */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (_req, file, cb) => cb(null, `cleanup-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

/* -------- No‑cache -------- */
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

userRouter.post('/', authenticate, upload.array('photos', 6), createCleanupRequest);
userRouter.get('/mine', authenticate, noCache, getOwnCleanupRequests);

/* Volunteers */
userRouter.get('/:id/volunteers', authenticate, noCache, getCleanupVolunteers);
userRouter.post('/:id/volunteer', authenticate, noCache, joinCleanup);
userRouter.delete('/:id/volunteer', authenticate, noCache, leaveCleanup);

/* ================== ADMIN (TOKEN + ROLE) ================== */
const adminRouter = express.Router();
adminRouter.use(authenticate, authorizeRole('Admin'));

adminRouter.get('/',           noCache, getAllCleanupRequests);
adminRouter.get('/:id',        noCache, getCleanupById);
adminRouter.put('/:id',        upload.array('photos', 6), noCache, updateCleanupRequest);
adminRouter.put('/:id/approve',  noCache, approveCleanupRequest);
adminRouter.put('/:id/reject',   noCache, rejectCleanupRequest);
adminRouter.put('/:id/schedule', upload.none(), noCache, scheduleCleanup);
adminRouter.put('/:id/complete', upload.none(), noCache, completeCleanup);
userRouter.get('/', authenticate, noCache, listPublicCleanups);
module.exports = {
  publicCleanupRouter: publicRouter,
  userCleanupRouter:   userRouter,
  adminCleanupRouter:  adminRouter,
};
