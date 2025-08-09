const Contact = require('../models/Contact');
const { sendContactEmail } = require('../utils/emailSender');

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Save to database
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message
    });

    // Send emails
    const emailSent = await sendContactEmail({
      name,
      email,
      phone,
      subject,
      message
    });

    if (!emailSent) {
      console.warn('Emails failed to send, but contact was saved');
    }

    res.status(201).json({
      success: true,
      contact,
      emailSent,
      message: emailSent ?
        'Thank you! Your message was sent successfully.' :
        'Message received, but email confirmation failed.'
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};