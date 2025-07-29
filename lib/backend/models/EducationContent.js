const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user      : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text      : { type: String, required: true },
  createdAt : { type: Date, default: Date.now },
});

/**
 * kind
 * ├─ image       – single illustrative image
 * ├─ video       – single video file
 * └─ comparison  – before / after gallery (array pairs)
 */
const educationContentSchema = new mongoose.Schema({
  title       : { type: String, required: true },
  description : String,
  kind        : { type: String, enum: ['image', 'video', 'comparison'], required: true },

  /* for image / video: one URL
     for comparison   : ignored, use beforeImages / afterImages */
  fileUrl     : String,
  thumbUrl    : String,

  /* comparison‐specific */
  beforeImages: [String],
  afterImages : [String],

  uploadedBy  : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes       : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments    : [commentSchema],

  // optional link back to the originating cleanup
  cleanupId   : { type: mongoose.Schema.Types.ObjectId, ref: 'Cleanup' },

  createdAt   : { type: Date, default: Date.now },
});

module.exports = mongoose.model('EducationContent', educationContentSchema);
