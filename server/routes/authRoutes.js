 const express = require('express');
const router = express.Router();

const {
  getProfile,
  login,
  updateEmail,
  changePassword,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/test', (req, res) => {
   res.json({
     success: true,
     message: 'Auth router is working',
  });
});

router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.patch('/profile/email', authMiddleware, updateEmail);
router.patch('/change-password', authMiddleware, changePassword);

module.exports = router;