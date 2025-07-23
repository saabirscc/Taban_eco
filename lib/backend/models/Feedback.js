// lib/backend/models/Feedback.js

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:        { type: String, required: true },
  rating:      { type: Number, required: true, min: 1, max: 5 },
  createdAt:   { type: Date,   default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
