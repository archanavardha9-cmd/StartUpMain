const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const leadRoutes = require('./routes/leadRoutes');
const errorHandler = require('./middleware/errorHandler');
const cmsRoutes = require('./routes/cmsRoutes');
const authRoutes = require('./routes/authRoutes');

console.log("CMS ROUTES LOADED");

const app = express();

// Security HTTP headers
app.use(helmet());

// Enable Compression
app.use(compression());

// Enable CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://new.startupcafe.co.in',
  'https://e.startupcafe.co.in',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : []),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS Policy restriction'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiting for API requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/cms' || req.path.startsWith('/cms/'),
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

// CMS editors make repeated reads and saves while content is being updated.
const cmsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many CMS requests from this IP. Please try again later.',
  },
});

// Stricter rate limit for lead submissions to prevent spam
const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 submissions per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Multiple inquiry submissions detected. Please wait a few minutes before submitting again.',
  },
});

app.use('/api/', limiter);
app.use('/api/leads', leadLimiter, leadRoutes);
app.use('/api/cms', cmsLimiter, cmsRoutes);
app.use('/api/auth', authRoutes);

console.log('Auth routes registered');

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Startup Cafe Backend API',
  });
});

// 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on server`,
  });
});

// Centralized Error Handler Middleware
app.use(errorHandler);

module.exports = app;
