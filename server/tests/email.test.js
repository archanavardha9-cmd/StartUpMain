const test = require('node:test');
const assert = require('node:assert/strict');
const nodemailer = require('nodemailer');

const originalCreateTransport = nodemailer.createTransport;
const envKeys = [
  'GMAIL_USER',
  'GMAIL_APP_PASSWORD',
  'NOTIFICATION_EMAIL',
  'ADMIN_URL',
  'NODE_ENV',
];
const originalEnv = Object.fromEntries(
  envKeys.map((key) => [key, process.env[key]])
);
let transportOptions;
let sentMessages;
let verificationCount;
let sendError;
let verifyError;

nodemailer.createTransport = (options) => {
  transportOptions = options;
  return {
    sendMail: async (message) => {
      sentMessages.push(message);
      if (sendError) throw sendError;
      return { messageId: 'test-message-id' };
    },
    verify: async () => {
      verificationCount += 1;
      if (verifyError) throw verifyError;
      return true;
    },
  };
};

const emailService = require('../utils/email');

test.before(() => {
  process.env.GMAIL_USER = 'admin@example.test';
  process.env.GMAIL_APP_PASSWORD = 'test-app-password';
  process.env.NOTIFICATION_EMAIL = 'notifications@example.test';
  process.env.ADMIN_URL = 'https://admin.example.test';
  process.env.NODE_ENV = 'test';
});

test.after(() => {
  nodemailer.createTransport = originalCreateTransport;
  for (const key of envKeys) {
    if (originalEnv[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = originalEnv[key];
    }
  }
});

test.beforeEach(() => {
  sentMessages = [];
  verificationCount = 0;
  sendError = null;
  verifyError = null;
});

test('password reset email uses Gmail SMTP, configured sender, recipient, and admin reset URL', async () => {
  await emailService.sendPasswordResetEmail(
    'admin@example.test',
    'a'.repeat(64)
  );

  assert.equal(transportOptions.service, 'gmail');
  assert.equal(transportOptions.auth.user, 'admin@example.test');
  assert.equal(transportOptions.auth.pass, 'test-app-password');
  assert.equal(sentMessages.length, 1);
  assert.equal(sentMessages[0].from, 'Startup Cafe <admin@example.test>');
  assert.equal(sentMessages[0].to, 'admin@example.test');
  assert.match(sentMessages[0].text, /https:\/\/admin\.example\.test\/reset-password\?token=/);
});

test('email-change verification uses the verified address and configured admin URL', async () => {
  await emailService.sendEmailChangeVerificationEmail(
    'new-admin@example.test',
    'b'.repeat(64)
  );

  assert.equal(sentMessages[0].to, 'new-admin@example.test');
  assert.match(sentMessages[0].text, /https:\/\/admin\.example\.test\/verify-email\?token=/);
});

test('lead notification goes to NOTIFICATION_EMAIL and safely escapes submitted content', async () => {
  await emailService.sendLeadNotificationEmail({
    fullName: '<script>alert(1)</script>',
    phone: '1234567890',
    email: 'lead@example.test',
    workspaceType: 'Day Pass',
    message: '<img src=x onerror=alert(1)>',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  });

  assert.equal(sentMessages[0].to, 'notifications@example.test');
  assert.equal(sentMessages[0].subject, 'New Lead Inquiry — Startup Cafe');
  assert.match(sentMessages[0].html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(sentMessages[0].html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.doesNotMatch(sentMessages[0].html, /<script>|<img src=x/);
});

test('SMTP diagnostic verifies the configured transport and returns safe failure details', async () => {
  await emailService.verifyEmailTransport();
  assert.equal(verificationCount, 1);

  const diagnostic = emailService.getEmailFailureDetails({
    code: 'EAUTH',
    message: 'private authentication response',
    command: 'AUTH PLAIN',
    responseCode: 535,
  });
  assert.equal(diagnostic.code, 'EAUTH');
  assert.equal(diagnostic.responseCode, 535);
  assert.match(diagnostic.action, /app password/);
  assert.equal(JSON.stringify(diagnostic).includes('private authentication response'), false);
});

test('email send failures propagate to callers instead of being reported as sent', async () => {
  const failure = Object.assign(new Error('SMTP delivery failed'), {
    code: 'EAUTH',
  });
  sendError = failure;

  await assert.rejects(
    emailService.sendPasswordResetEmail(
      'admin@example.test',
      'c'.repeat(64)
    ),
    (error) => error === failure
  );
});
