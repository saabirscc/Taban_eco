// routes/education.js
const express      = require('express');
const router       = express.Router();
const multer       = require('../config/multer');
const ctrl         = require('../controllers/educationController');
const { authenticate, authorizeRole } = require('../middlewares/auth');

// 🔴  add once and reuse
const noCache = (_req, res, next) => {
  res.set('Cache-Control', 'no-store, max-age=0');
  next();
};

/* ───────── Admin upload ───────── */
router.post(
  '/admin/education',
  authenticate, authorizeRole('Admin'),
  multer.fields([{ name: 'file',  maxCount: 1 },
                 { name: 'thumb', maxCount: 1 }]),
  ctrl.create
);

/* ───────── Public / User routes ───────── */
router.get ('/education',           authenticate, noCache, ctrl.list);
router.put ('/education/:id/like',  authenticate, noCache, ctrl.toggleLike);
router.post('/education/:id/comment', authenticate, noCache, ctrl.addComment);

module.exports = router;
