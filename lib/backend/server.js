// lib/backend/server.js
require('dotenv').config();
const express       = require('express');
const cors          = require('cors');
const helmet        = require('helmet');
const morgan        = require('morgan');
const rateLimit     = require('express-rate-limit');
const listEndpoints = require('express-list-endpoints');
const connectDB     = require('./config/db');

const authRouter       = require('./routes/auth');
const usersRouter      = require('./routes/users');
const feedbackRouter   = require('./routes/feedback');
const rewardRouter     = require('./routes/reward');
const adminUsersRouter = require('./routes/adminUsers');
const { userCleanupRouter, adminCleanupRouter,publicCleanupRouter } = require('./routes/cleanup');
const reportRouter     = require('./routes/report');           // ← Import the reports router
const { authenticate, authorizeRole } = require('./middlewares/auth');
const educationRouter = require('./routes/education');
const { getAdminMetrics } = require('./controllers/metricsController');
// Connect to database
connectDB();

const app = express();

/* ───────────── Security / util middleware ───────────── */
app.use(
  helmet({
    crossOriginResourcePolicy : false,
    crossOriginEmbedderPolicy  : false,
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

/* ───────────── CORS: accept absolutely everything ───────────── */
app.use(
  cors({
    origin: (o, cb) => cb(null, true),
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    credentials: false,
    optionsSuccessStatus: 204,
  })
);

/* ───────────── Body / static parsing ───────────── */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use('/api', educationRouter);

/* ───────────── Tiny request log (optional) ───────────── */
app.use((req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

/* ───────────── Public routes ───────────── */
app.use('/api/auth', authRouter);

/* ───────────── Authenticated user routes ───────────── */
app.use('/api/users',    authenticate, usersRouter);
app.use('/api/cleanup',  authenticate, userCleanupRouter);
app.use('/api/feedback', authenticate, feedbackRouter);
app.use('/api/rewards',  authenticate, rewardRouter);

/* ───────────── Admin routes ───────────── */
app.use(
  '/api/admin/users',
  authenticate,
  authorizeRole('Admin'),
  adminUsersRouter
);
app.use('/api/public/cleanups', publicCleanupRouter);
app.use(
  '/api/admin/cleanups',
  authenticate,
  authorizeRole('Admin'),
  adminCleanupRouter
);
app.use(
  '/api/admin/reports',                // ← Mount your report routes her
  reportRouter
);
app.get(
  '/api/admin/metrics',
  authenticate,
  authorizeRole('Admin'),
  getAdminMetrics
);
app.get(
  '/api/admin/metrics',
  authenticate,
  authorizeRole('Admin'),
  (_req, res) => {
    res.set('Cache-Control', 'no-store, max-age=0');
    res.json({ userCount: 0, cleanupCount: 0, pendingCount: 0 });
  }
);

/* ───────────── 404 & error handlers ───────────── */
app.use((req, res) => {
  console.warn(`[404] ${req.method} ${req.originalUrl}`);
  res.status(404).json({ msg: 'Route not found' });
});
app.use((err, _req, res, _next) => {
  console.error('[ERR]', err);
  res.status(err.statusCode || 500).json({ msg: err.message || 'Server error' });
});

/* ───────────── Start up ───────────── */
console.log('Registered endpoints:');
console.table(listEndpoints(app));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`🍆  API listening on port ${PORT}`)
);

process.on('SIGINT', () => {
  console.log('\nShutting down gracefully…');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
