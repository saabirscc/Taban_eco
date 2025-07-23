#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = 'admin@gmail.com';

    const exists = await User.findOne({ email });
    if (exists) {
      console.log('Admin user already present:', email);
      process.exit(0);
    }

    const admin = new User({
      fullName: 'Super Admin',
      email,
      password: await bcrypt.hash('Admin@123', 10),
      role: 'Admin',
      isVerified: true
    });

    await admin.save();
    console.log('✅  Admin seeded:', email, '/ password = Admin@123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
