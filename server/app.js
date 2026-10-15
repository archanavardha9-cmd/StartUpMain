const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
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
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use('/api/leads', leadRoutes);
app.use('/api/cms', cmsRoutes);
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
