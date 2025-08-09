// //lib/backend/controllers/settingController.js
// const Settings = require('../models/Setting');
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');

// exports.getSettings = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const settings = await Settings.findOne({ userId }) || {
//       profile: { fullName: '', email: '' },
//       system: { systemName: '' }
//     };
//     res.json(settings);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to load settings' });
//   }
// };

// exports.updateProfile = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { fullName, email } = req.body;
    
//     // Basic validation
//     if (!fullName || !email) {
//       return res.status(400).json({ message: 'Full name and email are required' });
//     }

//     // Update settings
//     await Settings.findOneAndUpdate(
//       { userId },
//       { $set: { 'profile.fullName': fullName, 'profile.email': email } },
//       { upsert: true, new: true }
//     );
    
//     res.json({ message: 'Profile updated successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to update profile' });
//   }
// };

// exports.updateSystem = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { systemName } = req.body;
    
//     await Settings.findOneAndUpdate(
//       { userId },
//       { $set: { 'system.systemName': systemName } },
//       { upsert: true, new: true }
//     );
    
//     res.json({ message: 'System settings updated' });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to update system settings' });
//   }
// };

// exports.updateSecurity = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { currentPassword, newPassword } = req.body;
    
//     // Verify current password
//     const user = await User.findById(userId);
//     const isMatch = await bcrypt.compare(currentPassword, user.password);
    
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Current password is incorrect' });
//     }
    
//     // Hash and save new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();
    
//     res.json({ message: 'Password changed successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to change password' });
//   }
// };
















// //lib/backend/controllers/settingController.js
// const Settings = require('../models/Setting');
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');

// exports.getSettings = async (req, res) => {
//   try {
//     const userId = req.user._id;
    
//     let settings = await Settings.findOne({ userId });
    
//     if (!settings) {
//       settings = await Settings.create({
//         userId,
//         profile: { 
//           fullName: req.user.name || '', 
//           email: req.user.email || '' 
//         },
//         system: { systemName: 'My System' }
//       });
//     }

//     res.status(200).json({
//       success: true,
//       profile: settings.profile,
//       system: settings.system
//     });
    
//   } catch (error) {
//     console.error('Error in getSettings:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Failed to load settings',
//       error: error.message 
//     });
//   }
// };

// exports.updateProfile = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { fullName, email } = req.body;
    
//     if (!fullName || !email) {
//       return res.status(400).json({
//         success: false,
//         message: 'Full name and email are required'
//       });
//     }

//     const updatedSettings = await Settings.findOneAndUpdate(
//       { userId },
//       { 
//         'profile.fullName': fullName,
//         'profile.email': email 
//       },
//       { 
//         new: true,
//         upsert: true,
//         runValidators: true 
//       }
//     );

//     res.status(200).json({
//       success: true,
//       message: 'Profile updated successfully',
//       settings: updatedSettings
//     });
    
//   } catch (error) {
//     console.error('Error in updateProfile:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update profile',
//       error: error.message
//     });
//   }
// };

// exports.updateSystem = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { systemName } = req.body;
    
//     if (!systemName) {
//       return res.status(400).json({
//         success: false,
//         message: 'System name is required'
//       });
//     }

//     const updatedSettings = await Settings.findOneAndUpdate(
//       { userId },
//       { 'system.systemName': systemName },
//       { 
//         new: true,
//         upsert: true 
//       }
//     );

//     res.status(200).json({
//       success: true,
//       message: 'System settings updated',
//       settings: updatedSettings
//     });
    
//   } catch (error) {
//     console.error('Error in updateSystem:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update system settings',
//       error: error.message
//     });
//   }
// };

// exports.updateSecurity = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { currentPassword, newPassword } = req.body;
    
//     if (!currentPassword || !newPassword) {
//       return res.status(400).json({
//         success: false,
//         message: 'Current and new password are required'
//       });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }
    
//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: 'Current password is incorrect'
//       });
//     }
    
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();
    
//     res.status(200).json({
//       success: true,
//       message: 'Password changed successfully'
//     });
    
//   } catch (error) {
//     console.error('Error in updateSecurity:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to change password',
//       error: error.message
//     });
//   }
// };














//try
const Settings = require('../models/Setting');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getSettings = async (req, res) => {
  try {
    const userId = req.user._id;

    let settings = await Settings.findOne({ userId });
    if (!settings) {
      settings = await Settings.create({
        userId,
        profile: {
          fullName: req.user.name || req.user.fullName || '',
          email: req.user.email || ''
        },
        system: { systemName: 'My System' }
      });
    }

    const admins = await User.find({ role: 'Admin' }).select('-password');

    res.status(200).json({
      success: true,
      profile: settings.profile,
      system: settings.system,
      admins
    });
  } catch (error) {
    console.error('Error in getSettings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load settings',
      error: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, email, password } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ success: false, message: 'Full name and email are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.fullName = fullName;
    user.email = email;

    if (password && password.length >= 8) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();

    const updatedSettings = await Settings.findOneAndUpdate(
      { userId },
      { 'profile.fullName': fullName, 'profile.email': email },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

exports.updateSystem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { systemName } = req.body;

    if (!systemName) {
      return res.status(400).json({ success: false, message: 'System name is required' });
    }

    const updatedSettings = await Settings.findOneAndUpdate(
      { userId },
      { 'system.systemName': systemName },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'System settings updated',
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Error in updateSystem:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update system settings',
      error: error.message
    });
  }
};

exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'Admin' }).select('-password');
    res.status(200).json({ success: true, admins });
  } catch (error) {
    console.error('Error in getAdmins:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin users',
      error: error.message
    });
  }
};

exports.addAdmin = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Full name, email and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'Admin',
      isActive: true,
      isVerified: true
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      admin: {
        _id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        isActive: admin.isActive
      }
    });
  } catch (error) {
    console.error('Error in addAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin user',
      error: error.message
    });
  }
};

// ✅ NEW: update admin (name/email/password and/or active status)
exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      fullName,
      name,        // accept either fullName or name
      email,
      password,    // optional
      isActive,    // boolean
      status       // optional: 'active' | 'inactive'
    } = req.body;

    const admin = await User.findOne({ _id: id, role: 'Admin' });
    if (!admin) return res.status(404).json({ success: false, message: 'Admin user not found' });

    // Normalize inputs
    if (typeof name === 'string' && !fullName) fullName = name;
    if (typeof email === 'string') email = email.toLowerCase();

    // Update fields
    if (typeof fullName === 'string') admin.fullName = fullName.trim();
    if (typeof email === 'string') {
      // Ensure email uniqueness if changed
      if (email !== admin.email) {
        const conflict = await User.findOne({ email });
        if (conflict && conflict._id.toString() !== admin._id.toString()) {
          return res.status(400).json({ success: false, message: 'Email already in use by another user' });
        }
      }
      admin.email = email;
    }

    // Update active using isActive or status
    if (typeof isActive === 'boolean') admin.isActive = isActive;
    if (typeof status === 'string') admin.isActive = status.toLowerCase() === 'active';

    // Optional password change
    if (password && password.trim().length > 0) {
      if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
      }
      admin.password = await bcrypt.hash(password, 10);
    }

    await admin.save();

    res.json({
      success: true,
      message: 'Admin updated',
      admin: {
        _id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        isActive: admin.isActive
      }
    });
  } catch (error) {
    console.error('Error in updateAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update admin',
      error: error.message
    });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;

    if (id === currentUserId.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }

    const admin = await User.findOneAndDelete({ _id: id, role: 'Admin' });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin user not found' });
    }

    res.status(200).json({ success: true, message: 'Admin user deleted successfully' });
  } catch (error) {
    console.error('Error in deleteAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete admin user',
      error: error.message
    });
  }
};
