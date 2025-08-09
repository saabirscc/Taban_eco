const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendContactEmail = async ({ name, email, phone, subject, message }) => {
  try {
    // Email to admin
    await transporter.sendMail({
      from: `EcoVolunteer App <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact: ${subject}`,
      html: `
        <h2>New Contact Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    });

    // Confirmation email to user
    await transporter.sendMail({
      from: `EcoVolunteer App <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `We received your ${subject} inquiry`,
      html: `
        <h2>Thank you for contacting us, ${name}!</h2>
        <p>We've received your message and will respond soon.</p>
        <p><strong>Your message:</strong></p>
        <p>${message}</p>
        <hr>
        <p>EcoVolunteer Team</p>
      `
    });

    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};