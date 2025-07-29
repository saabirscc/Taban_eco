const mongoose = require('mongoose');

const cleanupProgressSchema = new mongoose.Schema({
  beforeImage: {
    type: String,
    required: true,
  },
  afterImage: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const CleanupProgress = mongoose.model('CleanupProgress', cleanupProgressSchema);

module.exports = CleanupProgress;
