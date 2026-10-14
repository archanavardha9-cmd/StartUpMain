const Lead = require('../models/Lead');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { sendLeadNotificationEmail } = require('../utils/email');

/**
 * @desc    Create a new Lead/Inquiry
 * @route   POST /api/leads
 * @access  Public
 */
const createLead = async (req, res, next) => {
  try {
    const {
      fullName,
      phone,
      email,
      workspaceType,
      duration,
      startDate,
      people,
      message,
    } = req.body;

    const lead = await Lead.create({
      fullName,
      phone,
      email,
      workspaceType,
      duration: duration || '',
      startDate: startDate || null,
      people:
        people !== undefined && people !== '' && people !== null
          ? Number(people)
          : null,
      message: message || '',
    });

    // Send email notification in the background
    sendLeadNotificationEmail(lead);

    return successResponse(
      res,
      201,
      'Thank you! Your workspace inquiry has been submitted successfully. Our team will contact you shortly.',
      {
        id: lead._id,
        fullName: lead.fullName,
        phone: lead.phone,
        email: lead.email,
        workspaceType: lead.workspaceType,
        duration: lead.duration,
        startDate: lead.startDate,
        people: lead.people,
        message: lead.message,
        status: lead.status,
        createdAt: lead.createdAt,
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all leads (Admin utility)
 * @route   GET /api/leads
 * @access  Public (or protected)
 */
const getLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });

    return successResponse(
      res,
      200,
      'Leads fetched successfully',
      leads
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLead,
  getLeads,
};
