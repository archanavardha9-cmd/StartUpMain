const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session. Please log in again.',
      });
    }

    const admin = await Admin.findById(decoded.id);

    if (!admin || admin.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({
        success: false,
        message: 'Your session is invalid. Please log in again.',
      });
    }

    req.admin = {
      id: admin._id,
      email: admin.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;