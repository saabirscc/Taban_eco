// lib/backend/models/Cleanup.js

const mongoose = require('mongoose');

const cleanupSchema = new mongoose.Schema({
  createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:        { type: String, required: true },
  description:  { type: String },
  location:     { type: String },
  wasteType:    { type: String, enum: ['plastic','organic','hazardous','general'], required: true },
  severity:     { type: String, enum: ['low','moderate','high'], default: 'moderate' },

  photos: {
    type: [String],
    required: [true, 'At least one photo is required'],
    validate: {
      validator: arr => Array.isArray(arr) && arr.length > 0,
      message: 'At least one photo is required'
    }
  },

  status: {
    type: String,
    enum: ['pending','approved','scheduled','completed','rejected'],
    default: 'pending'
  },

  scheduledDate: Date,
  volunteers:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  latitude:      { type: Number },
  longitude:     { type: Number },

  // ── New fields for before/after comparison ──
  beforeImages: [String],
  afterImages:  [String],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cleanup', cleanupSchema);
