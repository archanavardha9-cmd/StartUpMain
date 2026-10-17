const test = require('node:test');
const assert = require('node:assert/strict');
const Lead = require('../models/Lead');
const emailService = require('../utils/email');
const { createLead } = require('../controllers/leadController');

const originalLeadCreate = Lead.create;
const originalSendLeadNotificationEmail =
  emailService.sendLeadNotificationEmail;
const originalLogEmailFailure = emailService.logEmailFailure;

const responseFor = () => ({
  statusCode: 200,
  body: null,
  status(statusCode) {
    this.statusCode = statusCode;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

test.after(() => {
  Lead.create = originalLeadCreate;
  emailService.sendLeadNotificationEmail =
    originalSendLeadNotificationEmail;
  emailService.logEmailFailure = originalLogEmailFailure;
});

test('lead remains saved and a success response is returned when notification delivery fails', async () => {
  let savedLead;
  const loggedFailures = [];

  Lead.create = async (leadData) => {
    savedLead = {
      ...leadData,
      _id: 'lead-1',
      createdAt: new Date(),
      status: 'New',
    };
    return savedLead;
  };
  emailService.sendLeadNotificationEmail = async () => {
    throw Object.assign(new Error('SMTP rejected message'), {
      code: 'EENVELOPE',
    });
  };
  emailService.logEmailFailure = (workflow, error) => {
    loggedFailures.push({ workflow, code: error.code });
  };

  const response = responseFor();
  await createLead(
    {
      body: {
        fullName: 'Test Admin',
        phone: '9670111167',
        email: 'visitor@example.test',
        workspaceType: 'Dedicated Desk',
        duration: '',
        startDate: null,
        people: null,
        message: '',
      },
    },
    response,
    (error) => {
      throw error;
    }
  );
  await new Promise((resolve) => setImmediate(resolve));

  assert.ok(savedLead);
  assert.equal(response.statusCode, 201);
  assert.equal(response.body.success, true);
  assert.deepEqual(loggedFailures, [
    { workflow: 'lead notification', code: 'EENVELOPE' },
  ]);
});
