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

    // Send notification without delaying the successful submission response.
    Promise.resolve(sendLeadNotificationEmail(lead)).catch((emailError) => {
      console.error('Lead notification email failed:', emailError.message);
    });

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
 * @desc    Get all leads
 * @route   GET /api/leads
 */
const getLeads = async (req, res, next) => {
  try {
    const {
      status,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (status && ['New', 'Contacted', 'Converted', 'Closed'].includes(status)) {
      filter.status = status;
    }

    if (search && search.trim()) {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      filter.$or = [
        { fullName: { $regex: escapedSearch, $options: 'i' } },
        { email: { $regex: escapedSearch, $options: 'i' } },
        { phone: { $regex: escapedSearch, $options: 'i' } },
      ];
    }

    const currentPage = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(limit) || 10));

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Lead.countDocuments(filter),
    ]);

    return successResponse(res, 200, 'Leads fetched successfully', {
      leads,
      pagination: {
        total,
        page: currentPage,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get one lead
 * @route   GET /api/leads/:id
 */
const getLeadById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!/^[a-f\d]{24}$/i.test(id)) {
      return errorResponse(res, 400, 'Invalid lead ID');
    }

    const lead = await Lead.findById(id).lean();

    if (!lead) {
      return errorResponse(res, 404, 'Lead not found');
    }

    return successResponse(res, 200, 'Lead fetched successfully', lead);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a lead's status
 * @route   PATCH /api/leads/:id/status
 */
const updateLeadStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!/^[a-f\d]{24}$/i.test(id)) {
      return errorResponse(res, 400, 'Invalid lead ID');
    }

    const allowedStatuses = ['New', 'Contacted', 'Converted', 'Closed'];

    if (!allowedStatuses.includes(status)) {
      return errorResponse(res, 400, 'Invalid lead status');
    }

    const lead = await Lead.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return errorResponse(res, 404, 'Lead not found');
    }

    return successResponse(res, 200, 'Lead status updated successfully', lead);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get lead dashboard statistics
 * @route   GET /api/leads/stats
 */
const getLeadStats = async (req, res, next) => {
  try {
    const [total, groupedStatuses] = await Promise.all([
      Lead.countDocuments(),
      Lead.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const counts = {
      New: 0,
      Contacted: 0,
      Converted: 0,
      Closed: 0,
    };

    groupedStatuses.forEach(({ _id, count }) => {
      if (Object.prototype.hasOwnProperty.call(counts, _id)) {
        counts[_id] = count;
      }
    });

    return successResponse(res, 200, 'Lead statistics fetched successfully', {
      total,
      ...counts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus,
  getLeadStats,
};