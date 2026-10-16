const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const createToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      tokenVersion: admin.tokenVersion,
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
};

const getProfile = (req, res) => {
  return res.status(200).json({
    success: true,
    admin: {
      id: req.admin.id,
      email: req.admin.email,
    },
  });
};

const updateEmail = async (req, res, next) => {
  try {
    const { email, currentPassword } = req.body || {};
    const normalizedEmail =
      typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (
      typeof currentPassword !== 'string' ||
      !currentPassword ||
      !normalizedEmail ||
      normalizedEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address and current password are required.',
      });
    }

    const admin = await Admin.findById(req.admin.id).select('+password');

    if (!admin || !(await bcrypt.compare(currentPassword, admin.password))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.',
      });
    }

    if (normalizedEmail === admin.email) {
      return res.status(400).json({
        success: false,
        message: 'The new email address matches your current email address.',
      });
    }

    const existingAdmin = await Admin.exists({
      email: normalizedEmail,
      _id: { $ne: admin._id },
    });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: 'An admin account already uses this email address.',
      });
    }

    admin.email = normalizedEmail;
    admin.tokenVersion += 1;
    await admin.save();

    return res.status(200).json({
      success: true,
      message: 'Email updated successfully. Please log in again.',
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An admin account already uses this email address.',
      });
    }

    return next(error);
  }
};

// Admin login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const admin = await Admin.findOne({
      email: email.trim().toLowerCase(),
    }).select('+password');

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token: createToken(admin),
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Change password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {};

    if (
      typeof currentPassword !== 'string' ||
      typeof newPassword !== 'string' ||
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.',
      });
    }

    if (newPassword.length < 12) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 12 characters long.',
      });
    }

    if (newPassword.length > 128) {
      return res.status(400).json({
        success: false,
        message: 'New password must be no more than 128 characters long.',
      });
    }

    const admin = await Admin.findById(req.admin.id).select('+password');

    if (!admin || !(await bcrypt.compare(currentPassword, admin.password))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.',
      });
    }

    if (await bcrypt.compare(newPassword, admin.password)) {
      return res.status(400).json({
        success: false,
        message: 'Choose a password different from your current password.',
      });
    }

    admin.password = await bcrypt.hash(newPassword, 12);
    admin.tokenVersion += 1;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully. Please log in again.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  login,
  updateEmail,
  changePassword,
};