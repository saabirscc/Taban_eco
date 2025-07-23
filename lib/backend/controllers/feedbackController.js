const Feedback               = require('../models/Feedback');
const { notifyAdminsOfFeedback, sendEmail } = require('../services/emailService');

exports.submitFeedback = async (req, res, next) => {
  try {
    const { text, rating } = req.body;
    if (!text || !rating) {
      return res.status(400).json({ msg: 'Text and rating are required.' });
    }

    // 1) Create & save feedback record
    const newFeedback = await Feedback.create({
      submittedBy: req.user.id,
      text,
      rating
    });

    // 2) Notify all Admins (or fallback to EMAIL_USER)
    await notifyAdminsOfFeedback({
      fromEmail: req.user.email,
      text,
      rating
    });

    // 3) Thank the submitting user (falls back to EMAIL_USER if missing)
    const recipient = req.user.email && req.user.email.length
      ? req.user.email
      : process.env.EMAIL_USER;

    await sendEmail(
      recipient,
      'Thanks for your feedback!',
      `
        <h1>We appreciate your input</h1>
        <p>You gave us <strong>${rating}</strong> stars and said:</p>
        <blockquote>${text}</blockquote>
        <p>Thank you for helping us make the app better!</p>
      `
    );

    res.status(201).json(newFeedback);
  } catch (err) {
    next(err);
  }
};

exports.getFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback
      .find()
      .populate('submittedBy', 'fullName email');
    res.json(feedbacks);
  } catch (err) {
    next(err);
  }
};
