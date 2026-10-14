 const express = require('express');
const router = express.Router();

const { login, changePassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/test', (req, res) => {
   res.json({
     success: true,
     message: 'Auth router is working',
  });
});

router.post('/login', login);
router.patch('/change-password', authMiddleware, changePassword);

module.exports = router;