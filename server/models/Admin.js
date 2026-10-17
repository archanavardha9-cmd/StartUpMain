const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },

    tokenVersion: {
      type: Number,
      default: 0,
    },

    passwordResetTokenHash: {
      type: String,
      select: false,
    },

    passwordResetTokenExpiresAt: {
      type: Date,
      select: false,
    },

    pendingEmail: {
      type: String,
      lowercase: true,
      trim: true,
      select: false,
    },

    emailChangeTokenHash: {
      type: String,
      select: false,
    },

    emailChangeTokenExpiresAt: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Admin', adminSchema);