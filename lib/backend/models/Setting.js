const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true
  },
  profile: {
    fullName: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  system: {
    systemName: {
      type: String,
      trim: true
    }
  }
}, {
  timestamps: true
});

// Index for faster querying
settingsSchema.index({ userId: 1 });

module.exports = mongoose.model('Settings', settingsSchema);