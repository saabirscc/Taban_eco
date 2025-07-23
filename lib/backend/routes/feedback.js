const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const { authenticate } = require('../middlewares/auth');
const { submitFeedback, getFeedbacks } = require('../controllers/feedbackController');

const upload = multer({ dest: 'uploads/' });

// Create feedback (with two file uploads: "before" and "after")
router.post(
  '/',
  authenticate,
  upload.fields([
    { name: 'before', maxCount: 1 },
    { name: 'after',  maxCount: 1 },
  ]),
  submitFeedback
);

// List all feedbacks (authenticated)
router.get('/', authenticate, getFeedbacks);

module.exports = router;
