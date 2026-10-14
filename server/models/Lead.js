const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
    },

    workspaceType: {
      type: String,
      required: [true, 'Workspace type is required'],
      enum: {
        values: [
          'Dedicated Desk',
          'Private Cabin',
          'Day Pass',
          'Conference Room',
        ],
        message:
          'Workspace type must be Dedicated Desk, Private Cabin, Day Pass, or Conference Room',
      },
    },

    // Booking details stored separately
    duration: {
      type: String,
      trim: true,
      maxlength: [100, 'Duration cannot exceed 100 characters'],
      default: '',
    },

    startDate: {
      type: Date,
      default: null,
    },

    people: {
      type: Number,
      min: [1, 'Number of people must be at least 1'],
      default: null,
    },

    message: {
      type: String,
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
      default: '',
    },

    status: {
      type: String,
      enum: ['New', 'Contacted', 'Converted', 'Closed'],
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
