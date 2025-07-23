const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text : { type: String, required: true },
  createdAt : { type: Date, default: Date.now }
});

const educationContentSchema = new mongoose.Schema({
  title       : { type: String, required: true },
  description : String,
  /** “video” | “image” */
  kind        : { type: String, enum: ['video','image'], required: true },
  fileUrl     : { type: String, required: true },
  thumbUrl    : String,
  uploadedBy  : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes       : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments    : [commentSchema],
  createdAt   : { type: Date, default: Date.now }
});

module.exports = mongoose.model('EducationContent', educationContentSchema);
