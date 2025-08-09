const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: String,
  subject: {
    type: String,
    required: [true, 'Please select a subject'],
    enum: [
      'General Inquiry',
      'Technical Support',
      'Partnership',
      'Feedback',
      'Other'
    ]
  },
  message: {
    type: String,
    required: [true, 'Please enter your message'],
    minlength: [20, 'Message should be at least 20 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contact', contactSchema);