const nodemailer = require('nodemailer');
const User       = require('../models/User');

// In development we allow self-signed certs:
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // your app-specific password
  },
  tls: { rejectUnauthorized: false },
});

/**
 * Send an HTML email.
 *
 * @param {string|string[]} to
 * @param {string}          subject
 * @param {string}          htmlContent
 */
async function sendEmail(to, subject, htmlContent) {
  const recipients = Array.isArray(to) ? to.filter(Boolean) : [to];
  if (recipients.length === 0) {
    throw new Error('No recipients defined for sendEmail()');
  }

  await transporter.sendMail({
    from:    process.env.EMAIL_USER,
    to:      recipients,
    subject,
    html:    htmlContent,
  });
}

/**
 * Notify all Admin users of new feedback.  
 * Falls back to emailing EMAIL_USER if no Admins exist.
 *
 * @param {{ fromEmail?: string, text: string, rating: number }} feedback
 */
async function notifyAdminsOfFeedback({ fromEmail, text, rating }) {
  // Lookup Admin emails
  const admins = await User.find({ role: 'Admin' }).select('email');
  const adminEmails = admins
    .map(u => u.email)
    .filter(e => typeof e === 'string' && e.length > 0);

  const recipients = adminEmails.length > 0
    ? adminEmails
    : [process.env.EMAIL_USER];

  const subject = `🆕 New Feedback from ${fromEmail || 'Unknown user'}`;
  const html    = `
    <h1>New Feedback Received</h1>
    <p><strong>User:</strong> ${fromEmail || 'Unknown'}</p>
    <p><strong>Rating:</strong> ${rating}/5</p>
    <p><strong>Comments:</strong></p>
    <blockquote>${text}</blockquote>
  `;

  await sendEmail(recipients, subject, html);
}

module.exports = {
  sendEmail,
  notifyAdminsOfFeedback,
};
