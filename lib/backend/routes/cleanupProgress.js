const express = require('express');
const multer = require('../config/multer'); // Import multer configuration
const CleanupStory = require('../models/CleanupStory'); // Import model

const router = express.Router();

// POST route to upload cleanup story
router.post('/post', multer.fields([
  { name: 'beforeImage', maxCount: 1 },
  { name: 'afterImage', maxCount: 1 }
]), async (req, res) => {
  const { location, description } = req.body;
  const beforeImage = req.files['beforeImage'] ? req.files['beforeImage'][0].path : null;
  const afterImage = req.files['afterImage'] ? req.files['afterImage'][0].path : null;

  if (!beforeImage || !afterImage) {
    return res.status(400).json({ msg: 'Both before and after images are required.' });
  }

  try {
    const newStory = new CleanupStory({
      beforeImage,
      afterImage,
      location,
      description,
    });

    await newStory.save();
    res.status(201).json({
      message: 'Cleanup story posted successfully!',
      data: newStory,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error posting cleanup story.', error: error.message });
  }
});

module.exports = router;
