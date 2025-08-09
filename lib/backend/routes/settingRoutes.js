// //lib/backend/routes/settingRoutes.js
// const express = require('express');
// const router = express.Router();
// const settingsController = require('../controllers/settingController');
// const { authenticate } = require('../middlewares/auth');

// // Update Profile
// router.put('/profile', authenticate, settingsController.updateProfile);

// // Update System
// router.put('/system', authenticate, settingsController.updateSystem);

// // Update Security (Password)
// router.put('/security', authenticate, settingsController.updateSecurity);

// module.exports = router;





// //lib/backend/controllers/settingController.js
// const express = require('express');
// const router = express.Router();
// const settingsController = require('../controllers/settingController');
// const { authenticate } = require('../middlewares/auth');

// // Get settings
// router.get('/', authenticate, settingsController.getSettings);

// // Update profile
// router.put('/profile', authenticate, settingsController.updateProfile);

// // Update system
// router.put('/system', authenticate, settingsController.updateSystem);

// // Update security
// router.put('/security', authenticate, settingsController.updateSecurity);

// module.exports = router;








//trying
const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingController');
const { authenticate, authorizeRole } = require('../middlewares/auth');

// GET /api/settings
router.get('/', authenticate, authorizeRole('Admin'), settingsController.getSettings);

// PUT /api/settings/profile
router.put('/profile', authenticate, authorizeRole('Admin'), settingsController.updateProfile);

// PUT /api/settings/system
router.put('/system', authenticate, authorizeRole('Admin'), settingsController.updateSystem);

// Admin management
// GET /api/settings/admins
router.get('/admins', authenticate, authorizeRole('Admin'), settingsController.getAdmins);

// POST /api/settings/admins
router.post('/admins', authenticate, authorizeRole('Admin'), settingsController.addAdmin);

// ✅ NEW: PUT /api/settings/admins/:id (edit name/email/password and/or toggle active)
router.put('/admins/:id', authenticate, authorizeRole('Admin'), settingsController.updateAdmin);

// DELETE /api/settings/admins/:id
router.delete('/admins/:id', authenticate, authorizeRole('Admin'), settingsController.deleteAdmin);

module.exports = router;
