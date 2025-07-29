// // lib/backend/server.js
// require('dotenv').config();
// const express       = require('express');
// const cors          = require('cors');
// const helmet        = require('helmet');
// const morgan        = require('morgan');
// const rateLimit     = require('express-rate-limit');
// const listEndpoints = require('express-list-endpoints');
// const path = require('path');
// const connectDB     = require('./config/db');

// const authRouter       = require('./routes/auth');
// const usersRouter      = require('./routes/users');
// const feedbackRouter   = require('./routes/feedback');
// const rewardRouter     = require('./routes/reward');
// const adminUsersRouter = require('./routes/adminUsers');
// const { userCleanupRouter, adminCleanupRouter,publicCleanupRouter } = require('./routes/cleanup');
// const reportRouter     = require('./routes/report');           // ← Import the reports router
// const { authenticate, authorizeRole } = require('./middlewares/auth');
// const educationRouter = require('./routes/education');
// const { getAdminMetrics } = require('./controllers/metricsController');
// const cleanupStoryRoutes = require('./routes/cleanupStories');

// // Connect to database
// connectDB();

// const app = express();

// /* ───────────── Security / util middleware ───────────── */
// app.use(
//   helmet({
//     crossOriginResourcePolicy : false,
//     crossOriginEmbedderPolicy  : false,
//   })
// );
// app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
// app.use(
//   rateLimit({
//     windowMs: 60_000,
//     max: 60,
//     message: { msg: 'Too many requests, slow down.' },
//     standardHeaders: true,
//     legacyHeaders: false,
//   })
// );

// /* ───────────── CORS: accept absolutely everything ───────────── */
// app.use(
//   cors({
//     origin: (o, cb) => cb(null, true),
//     methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
//     credentials: false,
//     optionsSuccessStatus: 204,
//   })
// );

// /* ───────────── Body / static parsing ───────────── */
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));
// app.use('/uploads', express.static('uploads'));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// app.use('/api', educationRouter);
// app.use('/api', cleanupStoryRoutes);
// app.use('/api/cleanup-progress', require('./routes/cleanupStories'));


// /* ───────────── Tiny request log (optional) ───────────── */
// app.use((req, _res, next) => {
//   console.log(`[REQ] ${req.method} ${req.originalUrl}`);
//   next();
// });

// /* ───────────── Public routes ───────────── */
// app.use('/api/auth', authRouter);

// /* ───────────── Authenticated user routes ───────────── */
// app.use('/api/users',    authenticate, usersRouter);
// app.use('/api/cleanup',  authenticate, userCleanupRouter);
// app.use('/api/feedback', authenticate, feedbackRouter);
// app.use('/api/rewards',  authenticate, rewardRouter);

// /* ───────────── Admin routes ───────────── */
// app.use(
//   '/api/admin/users',
//   authenticate,
//   authorizeRole('Admin'),
//   adminUsersRouter
// );
// app.use('/api/public/cleanups', publicCleanupRouter);
// app.use(
//   '/api/admin/cleanups',
//   authenticate,
//   authorizeRole('Admin'),
//   adminCleanupRouter
// );
// app.use(
//   '/api/admin/reports',                // ← Mount your report routes her
//   reportRouter
// );
// app.get(
//   '/api/admin/metrics',
//   authenticate,
//   authorizeRole('Admin'),
//   getAdminMetrics
// );
// app.get(
//   '/api/admin/metrics',
//   authenticate,
//   authorizeRole('Admin'),
//   (_req, res) => {
//     res.set('Cache-Control', 'no-store, max-age=0');
//     res.json({ userCount: 0, cleanupCount: 0, pendingCount: 0 });
//   }
// );

// /* ───────────── 404 & error handlers ───────────── */
// app.use((req, res) => {
//   console.warn(`[404] ${req.method} ${req.originalUrl}`);
//   res.status(404).json({ msg: 'Route not found' });
// });
// app.use((err, _req, res, _next) => {
//   console.error('[ERR]', err);
//   res.status(err.statusCode || 500).json({ msg: err.message || 'Server error' });
// });

// /* ───────────── Start up ───────────── */
// console.log('Registered endpoints:');
// console.table(listEndpoints(app));

// const PORT = process.env.PORT || 5000;
// const server = app.listen(PORT, () =>
//   console.log(`🍆  API listening on port ${PORT}`)
// );

// process.on('SIGINT', () => {
//   console.log('\nShutting down gracefully…');
//   server.close(() => {
//     console.log('HTTP server closed');
//     process.exit(0);
//   });
// });


















//sabirin updated the code
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
// const listEndpoints = require('express-list-endpoints');
// const connectDB = require('./config/db');

// const authRouter = require('./routes/auth');
// const usersRouter = require('./routes/users');
// const feedbackRouter = require('./routes/feedback');
// const rewardRouter = require('./routes/reward');
// const adminUsersRouter = require('./routes/adminUsers');
// const { userCleanupRouter, adminCleanupRouter, publicCleanupRouter } = require('./routes/cleanup');
// const reportRouter = require('./routes/report'); // ← Import the reports router
// const { authenticate, authorizeRole } = require('./middlewares/auth');
// const educationRouter = require('./routes/education');
// const { getAdminMetrics } = require('./controllers/metricsController');
// const multer = require('multer');

// // Connect to database
// connectDB();

// const app = express();

// /* ───────────── Security / util middleware ───────────── */
// app.use(
//   helmet({
//     crossOriginResourcePolicy: false,
//     crossOriginEmbedderPolicy: false,
//   })
// );
// app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
// app.use(
//   rateLimit({
//     windowMs: 60_000,
//     max: 60,
//     message: { msg: 'Too many requests, slow down.' },
//     standardHeaders: true,
//     legacyHeaders: false,
//   })
// );

// /* ───────────── CORS: accept absolutely everything ───────────── */
// app.use(
//   cors({
//     origin: (o, cb) => cb(null, true),
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     credentials: false,
//     optionsSuccessStatus: 204,
//   })
// );

// /* ───────────── Body / static parsing ───────────── */
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));
// app.use('/uploads', express.static('uploads'));

// /* ───────────── Tiny request log (optional) ───────────── */
// app.use((req, _res, next) => {
//   console.log(`[REQ] ${req.method} ${req.originalUrl}`);
//   next();
// });

// /* ───────────── Public routes ───────────── */
// app.use('/api/auth', authRouter);

// /* ───────────── Authenticated user routes ───────────── */
// app.use('/api/users', authenticate, usersRouter);
// app.use('/api/cleanup', authenticate, userCleanupRouter);
// app.use('/api/feedback', authenticate, feedbackRouter);
// app.use('/api/rewards', authenticate, rewardRouter);

// /* ───────────── Admin routes ───────────── */
// app.use(
//   '/api/admin/users',
//   authenticate,
//   authorizeRole('Admin'),
//   adminUsersRouter
// );
// app.use('/api/public/cleanups', publicCleanupRouter);
// app.use(
//   '/api/admin/cleanups',
//   authenticate,
//   authorizeRole('Admin'),
//   adminCleanupRouter
// );

// // Report Route Integration
// app.use('/api/admin/reports', reportRouter);

// // Metrics Route
// app.get(
//   '/api/admin/metrics',
//   authenticate,
//   authorizeRole('Admin'),
//   getAdminMetrics
// );
// app.get(
//   '/api/admin/metrics',
//   authenticate,
//   authorizeRole('Admin'),
//   (_req, res) => {
//     res.set('Cache-Control', 'no-store, max-age=0');
//     res.json({ userCount: 0, cleanupCount: 0, pendingCount: 0 });
//   }
// );

// /* ───────────── 404 & error handlers ───────────── */
// app.use((req, res) => {
//   console.warn(`[404] ${req.method} ${req.originalUrl}`);
//   res.status(404).json({ msg: 'Route not found' });
// });
// app.use((err, _req, res, _next) => {
//   console.error('[ERR]', err);
//   res.status(err.statusCode || 500).json({ msg: err.message || 'Server error' });
// });

// /* ───────────── Add the cleanup progress upload endpoint here ───────────── */
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + file.originalname);
//   },
// });

// const upload = multer({ storage });

// // API endpoint for uploading before & after cleanup images
// app.post('/api/cleanup-progress/upload', upload.fields([
//   { name: 'beforeImage', maxCount: 1 },
//   { name: 'afterImage', maxCount: 1 }
// ]), (req, res) => {
//   const { location, description } = req.body;
//   const beforeImage = req.files['beforeImage'] ? req.files['beforeImage'][0].path : null;
//   const afterImage = req.files['afterImage'] ? req.files['afterImage'][0].path : null;

//   if (!beforeImage || !afterImage) {
//     return res.status(400).json({ msg: 'Both before and after images are required.' });
//   }

//   const newCleanupProgress = {
//     beforeImage,
//     afterImage,
//     location,
//     description,
//     timestamp: new Date()
//   };

//   // Save to the database or file system as needed
//   // Assuming you have a cleanup progress model to save this data
//   // Example:
//   // const newProgress = new CleanupProgress(newCleanupProgress);
//   // newProgress.save()
//   //   .then(() => res.status(201).json({ message: 'Cleanup progress uploaded successfully!', data: newProgress }))
//   //   .catch(err => res.status(500).json({ message: 'Server error', error: err }));

//   // For now, just sending a success response without DB logic.
//   res.status(201).json({
//     message: 'Cleanup progress uploaded successfully!',
//     data: newCleanupProgress,
//   });
// });

// /* ───────────── Start up ───────────── */
// console.log('Registered endpoints:');
// console.table(listEndpoints(app));

// const PORT = process.env.PORT || 5000;
// const server = app.listen(PORT, () =>
//   console.log(`🍆  API listening on port ${PORT}`)
// );

// process.on('SIGINT', () => {
//   console.log('\nShutting down gracefully…');
//   server.close(() => {
//     console.log('HTTP server closed');
//     process.exit(0);
//   });
// });













//last
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const listEndpoints = require('express-list-endpoints');
const path = require('path');
const multer = require('multer');
const connectDB = require('./config/db');

// Import routes
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const feedbackRouter = require('./routes/feedback');
const rewardRouter = require('./routes/reward');
const adminUsersRouter = require('./routes/adminUsers');
const { userCleanupRouter, adminCleanupRouter, publicCleanupRouter } = require('./routes/cleanup');
const reportRouter = require('./routes/report');
const { authenticate, authorizeRole } = require('./middlewares/auth');
const educationRouter = require('./routes/education');
const { getAdminMetrics } = require('./controllers/metricsController');
const cleanupStoryRoutes = require('./routes/cleanupStories');
const videoStreamRouter = require('./routes/videoStream');
// Connect to database
connectDB();

const app = express();

/* ───────────── Configure Multer for File Uploads ───────────── */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads/cleanups'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cleanup-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/* ───────────── Middleware ───────────── */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(
  rateLimit({
    windowMs: 60_000,
    max: 60,
    message: { msg: 'Too many requests, slow down.' },
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(
  cors({
    origin: (o, cb) => cb(null, true),
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    credentials: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ───────────── Routes ───────────── */
app.use('/api', educationRouter);
app.use('/api', cleanupStoryRoutes);
app.use('/api/cleanup-progress', require('./routes/cleanupStories'));

// Image Upload Endpoint
app.post('/api/cleanup/upload', upload.array('images', 10), (req, res) => {
  const fileUrls = req.files.map(file => 
    `/uploads/cleanups/${file.filename}`
  );
  res.json({ success: true, urls: fileUrls });
});

app.use((req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});
app.use('/api/video', videoStreamRouter);   // ⇦ add this
/* ───────────── Route Groups ───────────── */
app.use('/api/auth', authRouter);
app.use('/api/users', authenticate, usersRouter);
app.use('/api/cleanup', authenticate, userCleanupRouter);
app.use('/api/feedback', authenticate, feedbackRouter);
app.use('/api/rewards', authenticate, rewardRouter);
app.use('/api/admin/users', authenticate, authorizeRole('Admin'), adminUsersRouter);
app.use('/api/public/cleanups', publicCleanupRouter);
app.use('/api/admin/cleanups', authenticate, authorizeRole('Admin'), adminCleanupRouter);
app.use('/api/admin/reports', reportRouter);
app.get('/api/admin/metrics', authenticate, authorizeRole('Admin'), getAdminMetrics);

/* ───────────── Error Handlers ───────────── */
app.use((req, res) => {
  console.warn(`[404] ${req.method} ${req.originalUrl}`);
  res.status(404).json({ msg: 'Route not found' });
});

app.use((err, _req, res, _next) => {
  console.error('[ERR]', err);
  res.status(err.statusCode || 500).json({ msg: err.message || 'Server error' });
});

/* ───────────── Start Server ───────────── */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`♻️🧹📸❤️: i think im falling in love---on port ${PORT}`);
  console.log('Registered endpoints:');
  console.table(listEndpoints(app));
});

process.on('SIGINT', () => {
  console.log('\nShutting down gracefully…');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});