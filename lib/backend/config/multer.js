// backend/config/multer.js
const multer = require('multer');
const path = require('path');

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure this matches your uploads folder
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // prefix with field name and timestamp
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

// Optional: filter by file type (images, video, pdf, etc.)
const fileFilter = (req, file, cb) => {
  // Accept any file by default
  cb(null, true);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: {
    // Max file size in bytes (e.g., 50MB)
    fileSize: 50 * 1024 * 1024,
  },
});




//sabirin updated multer configuration
// backend/config/multer.js
// const multer = require('multer');
// const path = require('path');

// // Configure disk storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Ensure this matches your uploads folder
//     cb(null, path.join(__dirname, '../uploads'));
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     // Prefix with field name and timestamp
//     cb(null, `${file.fieldname}-${Date.now()}${ext}`);
//   },
// });

// // Optional: filter by file type (images, video, pdf, etc.)
// const fileFilter = (req, file, cb) => {
//   // Only allow images (you can modify the mime types based on your needs)
//   if (file.mimetype.startsWith('image')) {
//     cb(null, true); // Accept image files
//   } else {
//     cb(new Error('Only image files are allowed!'), false); // Reject non-image files
//   }
// };

// module.exports = multer({
//   storage,
//   fileFilter,
//   limits: {
//     // Max file size in bytes (e.g., 50MB)
//     fileSize: 50 * 1024 * 1024, // 50MB max
//   },
// });
