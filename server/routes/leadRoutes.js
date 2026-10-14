const express = require('express');
const router = express.Router();

const {
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus,
  getLeadStats,
} = require('../controllers/leadController');

const { validateLeadInput } = require('../middleware/validateLead');
const authMiddleware = require('../middleware/authMiddleware');

// Public: website visitors can submit booking inquiries
router.post('/', validateLeadInput, createLead);

// Protected: only authenticated admins can manage leads
router.get('/stats', authMiddleware, getLeadStats);
router.get('/:id', authMiddleware, getLeadById);
router.get('/', authMiddleware, getLeads);
router.patch('/:id/status', authMiddleware, updateLeadStatus);

module.exports = router;