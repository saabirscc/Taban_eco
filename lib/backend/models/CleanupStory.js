const mongoose = require('mongoose');

const cleanupStorySchema = new mongoose.Schema({
  beforeImage: String,
  afterImage: String,
  location: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

// Use this pattern to avoid OverwriteModelError
module.exports = mongoose.models.CleanupStory || mongoose.model('CleanupStory', cleanupStorySchema);