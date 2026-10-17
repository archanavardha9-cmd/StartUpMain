const express = require('express');
const { rateLimit } = require('express-rate-limit');
const router = express.Router();

const {
  getProfile,
  login,
  requestEmailChange,
  confirmEmailChange,
  requestPasswordReset,
  resetPassword,
  changePassword,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many sign-in attempts. Try again later.' },
});

const passwordResetRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
});

const accountChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

router.get('/test', (req, res) => {
   res.json({
     success: true,
     message: 'Auth router is working',
  });
});

router.post('/login', loginLimiter, login);
router.post('/forgot-password', passwordResetRequestLimiter, requestPasswordReset);
router.post('/reset-password', passwordResetLimiter, resetPassword);
router.post('/profile/email/confirm', passwordResetLimiter, confirmEmailChange);
router.get('/profile', authMiddleware, getProfile);
router.patch('/profile/email', authMiddleware, accountChangeLimiter, requestEmailChange);
router.patch('/change-password', authMiddleware, accountChangeLimiter, changePassword);

module.exports = router;