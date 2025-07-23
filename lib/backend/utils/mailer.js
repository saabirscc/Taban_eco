const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlContent
  };

  await transporter.sendMail(mailOptions);
};
exports.sendFeedbackEmail = async (feedback) => {
  const { cleanup, text, rating, beforePhoto, afterPhoto } = feedback;
  const subject = `New Feedback from ${cleanup}`;
  const htmlContent = `
    <h1>New Feedback Received</h1>
    <p><strong>Cleanup:</strong> ${cleanup}</p>
    <p><strong>Text:</strong> ${text}</p>
    <p><strong>Rating:</strong> ${rating}</p>
    <img src="${beforePhoto}" alt="Before Photo" />
    <img src="${afterPhoto}" alt="After Photo" />
  `;
  await this.sendEmail(process.env.FEEDBACK_EMAIL, subject, htmlContent);
};