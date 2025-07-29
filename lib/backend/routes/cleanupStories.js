const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const cleanupStoryController = require('../controllers/cleanupStoryController');

// Setup multer for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Create a new cleanup story
router.post('/post', upload.fields([{ name: 'beforeImage', maxCount: 1 }, { name: 'afterImage', maxCount: 1 }]), cleanupStoryController.createCleanupStory);

// Get all cleanup stories
router.get('/', cleanupStoryController.getCleanupStories);// In your routes file


// Delete a cleanup story
router.delete('/delete/:id', cleanupStoryController.deleteCleanupStory);

// Update a cleanup story
router.put('/update/:id', cleanupStoryController.updateCleanupStory);

module.exports = router;