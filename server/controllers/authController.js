const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Admin = require('../models/Admin');
const emailService = require('../utils/email');

const TOKEN_EXPIRATION_MS = 30 * 60 * 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESET_LINK_SENT_MESSAGE =
  'The Password reset link has been sent to this email address.';
const UNREGISTERED_ADMIN_EMAIL_MESSAGE =
  'This email address is not registered as an administrator. Please check the email address and try again.';
const RESET_EMAIL_DELIVERY_ERROR_MESSAGE =
  'Unable to send the password reset email. Please try again later.';

const normalizeEmail = (email) =>
  typeof email === 'string' ? email.trim().toLowerCase() : '';

const createOneTimeToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  return {
    token,
    tokenHash: crypto.createHash('sha256').update(token).digest('hex'),
  };
};

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

const requestEmailChange = async (req, res, next) => {
  try {
    const { email, currentPassword } = req.body || {};
    const normalizedEmail = normalizeEmail(email);

    if (
      typeof currentPassword !== 'string' ||
      !currentPassword ||
      !normalizedEmail ||
      normalizedEmail.length > 254 ||
      !EMAIL_PATTERN.test(normalizedEmail)
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

    const { token, tokenHash } = createOneTimeToken();
    admin.pendingEmail = normalizedEmail;
    admin.emailChangeTokenHash = tokenHash;
    admin.emailChangeTokenExpiresAt = new Date(Date.now() + TOKEN_EXPIRATION_MS);
    await admin.save();

    try {
      await emailService.sendEmailChangeVerificationEmail(normalizedEmail, token);
    } catch (error) {
      emailService.logEmailFailure('email change verification', error);
      await Admin.updateOne(
        { _id: admin._id, emailChangeTokenHash: tokenHash },
        {
          $unset: {
            pendingEmail: 1,
            emailChangeTokenHash: 1,
            emailChangeTokenExpiresAt: 1,
          },
        }
      );
      console.error('[Auth] Email change verification could not be delivered.');
      return res.status(503).json({
        success: false,
        message: 'Unable to send a verification email. Please try again later.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'A verification link has been sent to the new email address.',
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

const confirmEmailChange = async (req, res, next) => {
  try {
    const { token } = req.body || {};

    if (typeof token !== 'string' || !/^[a-f\d]{64}$/i.test(token)) {
      return res.status(400).json({
        success: false,
        message: 'This email verification link is invalid or has expired.',
      });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const now = new Date();
    const adminWithPendingEmail = await Admin.findOne({
      emailChangeTokenHash: tokenHash,
      emailChangeTokenExpiresAt: { $gt: now },
    }).select('+pendingEmail');

    if (!adminWithPendingEmail?.pendingEmail) {
      return res.status(400).json({
        success: false,
        message: 'This email verification link is invalid or has expired.',
      });
    }

    const admin = await Admin.findOneAndUpdate(
      {
        _id: adminWithPendingEmail._id,
        emailChangeTokenHash: tokenHash,
        emailChangeTokenExpiresAt: { $gt: now },
      },
      {
        $set: { email: adminWithPendingEmail.pendingEmail },
        $inc: { tokenVersion: 1 },
        $unset: {
          pendingEmail: 1,
          emailChangeTokenHash: 1,
          emailChangeTokenExpiresAt: 1,
          passwordResetTokenHash: 1,
          passwordResetTokenExpiresAt: 1,
        },
      },
      { new: true, runValidators: true }
    );

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: 'This email verification link is invalid or has expired.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Email address verified. Please sign in again with your new email.',
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'That email address is already in use.',
      });
    }

    return next(error);
  }
};

const requestPasswordReset = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email);

    if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid email address.',
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: UNREGISTERED_ADMIN_EMAIL_MESSAGE,
      });
    }

    const { token, tokenHash } = createOneTimeToken();
    await Admin.updateOne(
      { _id: admin._id },
      {
        $set: {
          passwordResetTokenHash: tokenHash,
          passwordResetTokenExpiresAt: new Date(
            Date.now() + TOKEN_EXPIRATION_MS
          ),
        },
      }
    );

    try {
      await emailService.sendPasswordResetEmail(email, token);
    } catch (error) {
      emailService.logEmailFailure('password reset', error);
      await Admin.updateOne(
        { _id: admin._id, passwordResetTokenHash: tokenHash },
        {
          $unset: {
            passwordResetTokenHash: 1,
            passwordResetTokenExpiresAt: 1,
          },
        }
      );
      return res.status(503).json({
        success: false,
        message: RESET_EMAIL_DELIVERY_ERROR_MESSAGE,
      });
    }

    return res.status(200).json({
      success: true,
      message: RESET_LINK_SENT_MESSAGE,
    });
  } catch (error) {
    return next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword, confirmPassword } = req.body || {};

    if (
      typeof token !== 'string' ||
      !/^[a-f\d]{64}$/i.test(token) ||
      typeof newPassword !== 'string' ||
      typeof confirmPassword !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message: 'The reset link and both password fields are required.',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    if (newPassword.length < 12 || newPassword.length > 128) {
      return res.status(400).json({
        success: false,
        message: 'Password must be between 12 and 128 characters long.',
      });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const tokenRecord = await Admin.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetTokenExpiresAt: { $gt: new Date() },
    }).select('_id');

    if (!tokenRecord) {
      return res.status(400).json({
        success: false,
        message: 'This password reset link is invalid or has expired.',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const updatedAdmin = await Admin.findOneAndUpdate(
      {
        _id: tokenRecord._id,
        passwordResetTokenHash: tokenHash,
        passwordResetTokenExpiresAt: { $gt: new Date() },
      },
      {
        $set: { password: hashedPassword },
        $inc: { tokenVersion: 1 },
        $unset: {
          passwordResetTokenHash: 1,
          passwordResetTokenExpiresAt: 1,
          pendingEmail: 1,
          emailChangeTokenHash: 1,
          emailChangeTokenExpiresAt: 1,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedAdmin) {
      return res.status(400).json({
        success: false,
        message: 'This password reset link is invalid or has expired.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully. Please sign in with your new password.',
    });
  } catch (error) {
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
      email: normalizeEmail(email),
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

    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    const updateResult = await Admin.updateOne(
      { _id: admin._id, password: admin.password },
      {
        $set: { password: newPasswordHash },
        $inc: { tokenVersion: 1 },
        $unset: {
          passwordResetTokenHash: 1,
          passwordResetTokenExpiresAt: 1,
          pendingEmail: 1,
          emailChangeTokenHash: 1,
          emailChangeTokenExpiresAt: 1,
        },
      }
    );

    if (updateResult.matchedCount !== 1) {
      return res.status(401).json({
        success: false,
        message: 'Your session is invalid. Please log in again.',
      });
    }

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
  requestEmailChange,
  confirmEmailChange,
  requestPasswordReset,
  resetPassword,
  changePassword,
};