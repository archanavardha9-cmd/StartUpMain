const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const emailService = require('../utils/email');
const authController = require('../controllers/authController');

const originalAdminMethods = {};
const originalEmailMethods = {};
let adminRecord;
let resetEmails;
let verificationEmails;
let resetEmailError;
let originalJwtSecret;

const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const matches = (record, filter) =>
  Boolean(
    record &&
      Object.entries(filter).every(([key, expected]) => {
        if (key === '_id' && expected?.$ne) {
          return record._id !== expected.$ne;
        }
        if (expected && typeof expected === 'object' && expected.$gt) {
          return record[key] > expected.$gt;
        }
        return record[key] === expected;
      })
  );

const makeQuery = (record) => {
  const query = {
    select: async () => record,
    then: (resolve, reject) => Promise.resolve(record).then(resolve, reject),
  };
  return query;
};

const applyUpdate = (record, update) => {
  Object.assign(record, update.$set || {});
  for (const [key, value] of Object.entries(update.$inc || {})) {
    record[key] = (record[key] || 0) + value;
  }
  for (const key of Object.keys(update.$unset || {})) {
    delete record[key];
  }
};

const responseFor = async (handler, req) => {
  const response = {
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
  };
  let nextError;
  await handler(req, response, (error) => {
    nextError = error;
  });
  if (nextError) throw nextError;
  return response;
};

test.before(async () => {
  for (const method of ['findOne', 'findOneAndUpdate', 'findById', 'updateOne', 'exists']) {
    originalAdminMethods[method] = Admin[method];
  }
  originalEmailMethods.sendPasswordResetEmail =
    emailService.sendPasswordResetEmail;
  originalEmailMethods.sendEmailChangeVerificationEmail =
    emailService.sendEmailChangeVerificationEmail;
  originalJwtSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'auth-controller-test-secret';

  Admin.findOne = (filter) =>
    makeQuery(matches(adminRecord, filter) ? adminRecord : null);
  Admin.findById = (id) =>
    makeQuery(adminRecord?._id === id ? adminRecord : null);
  Admin.findOneAndUpdate = async (filter, update) => {
    if (!matches(adminRecord, filter)) return null;
    applyUpdate(adminRecord, update);
    return { _id: adminRecord._id };
  };
  Admin.updateOne = async (filter, update) => {
    if (!matches(adminRecord, filter)) return { matchedCount: 0 };
    applyUpdate(adminRecord, update);
    return { matchedCount: 1 };
  };
  Admin.exists = async (filter) =>
    matches(adminRecord, filter) ? { _id: adminRecord._id } : null;

  emailService.sendPasswordResetEmail = async (email, token) => {
    resetEmails.push({ email, token });
    if (resetEmailError) throw resetEmailError;
  };
  emailService.sendEmailChangeVerificationEmail = async (email, token) => {
    verificationEmails.push({ email, token });
  };
});

test.after(() => {
  for (const [method, original] of Object.entries(originalAdminMethods)) {
    Admin[method] = original;
  }
  for (const [method, original] of Object.entries(originalEmailMethods)) {
    emailService[method] = original;
  }
  if (originalJwtSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = originalJwtSecret;
  }
});

test.beforeEach(async () => {
  adminRecord = {
    _id: 'admin-1',
    email: 'admin@example.com',
    password: await bcrypt.hash('PreviousPassword123!', 4),
    tokenVersion: 3,
    save: async () => adminRecord,
  };
  resetEmails = [];
  verificationEmails = [];
  resetEmailError = null;
});

test('forgot-password sends a reset email to a registered administrator and stores only a token hash', async () => {
  const invalid = await responseFor(authController.requestPasswordReset, {
    body: { email: 'not-an-email' },
  });
  assert.equal(invalid.statusCode, 400);
  assert.equal(resetEmails.length, 0);

  const known = await responseFor(authController.requestPasswordReset, {
    body: { email: ' ADMIN@example.com ' },
  });
  assert.equal(known.statusCode, 200);
  assert.equal(resetEmails.length, 1);
  assert.equal(resetEmails[0].email, 'admin@example.com');
  assert.match(adminRecord.passwordResetTokenHash, /^[a-f\d]{64}$/);
  assert.notEqual(adminRecord.passwordResetTokenHash, resetEmails[0].token);
  assert.equal(
    adminRecord.passwordResetTokenHash,
    hashToken(resetEmails[0].token)
  );

  const firstToken = resetEmails[0].token;
  await responseFor(authController.requestPasswordReset, {
    body: { email: 'admin@example.com' },
  });
  assert.equal(resetEmails.length, 2);
  assert.notEqual(resetEmails[1].token, firstToken);
  assert.equal(
    adminRecord.passwordResetTokenHash,
    hashToken(resetEmails[1].token)
  );
  const previousTokenAttempt = await responseFor(authController.resetPassword, {
    body: {
      token: firstToken,
      newPassword: 'NewSecurePassword123!',
      confirmPassword: 'NewSecurePassword123!',
    },
  });
  assert.equal(previousTokenAttempt.statusCode, 400);

  assert.equal(
    known.body.message,
    'If an administrator account exists for this email, a password reset link will be sent.'
  );
});

test('forgot-password returns a clear error for an unregistered email', async () => {
  adminRecord = null;
  const unknown = await responseFor(authController.requestPasswordReset, {
    body: { email: 'unknown@example.com' },
  });
  assert.equal(unknown.statusCode, 404);
  assert.equal(unknown.body.success, false);
  assert.equal(
    unknown.body.message,
    'This email address is not registered as an administrator. Please check the email address and try again.'
  );
  assert.equal(resetEmails.length, 0);
});

test('forgot-password returns a delivery error and invalidates the undelivered reset token', async () => {
  resetEmailError = new Error('Provider failure with private details');

  const result = await responseFor(authController.requestPasswordReset, {
    body: { email: 'admin@example.com' },
  });

  assert.equal(result.statusCode, 503);
  assert.equal(result.body.success, false);
  assert.equal(
    result.body.message,
    'Unable to send the password reset email. Please try again later.'
  );
  assert.equal('passwordResetTokenHash' in adminRecord, false);
  assert.equal('passwordResetTokenExpiresAt' in adminRecord, false);
  assert.equal(JSON.stringify(result.body).includes('private details'), false);
  assert.equal(resetEmails.length, 1);
});

test('reset-password updates credentials, invalidates sessions, and consumes the token once', async () => {
  const token = 'a'.repeat(64);
  const previousHash = adminRecord.password;
  adminRecord.passwordResetTokenHash = hashToken(token);
  adminRecord.passwordResetTokenExpiresAt = new Date(Date.now() + 60_000);
  adminRecord.tokenVersion = 3;

  const reset = await responseFor(authController.resetPassword, {
    body: {
      token,
      newPassword: 'NewSecurePassword123!',
      confirmPassword: 'NewSecurePassword123!',
    },
  });

  assert.equal(reset.statusCode, 200);
  assert.equal(await bcrypt.compare('NewSecurePassword123!', adminRecord.password), true);
  assert.equal(await bcrypt.compare('PreviousPassword123!', adminRecord.password), false);
  assert.notEqual(adminRecord.password, previousHash);
  assert.equal(adminRecord.tokenVersion, 4);
  assert.equal('passwordResetTokenHash' in adminRecord, false);
  assert.equal(JSON.stringify(reset.body).includes(adminRecord.password), false);

  const replay = await responseFor(authController.resetPassword, {
    body: {
      token,
      newPassword: 'AnotherSecurePassword123!',
      confirmPassword: 'AnotherSecurePassword123!',
    },
  });
  assert.equal(replay.statusCode, 400);

  const oldLogin = await responseFor(authController.login, {
    body: { email: adminRecord.email, password: 'PreviousPassword123!' },
  });
  const newLogin = await responseFor(authController.login, {
    body: { email: adminRecord.email, password: 'NewSecurePassword123!' },
  });
  assert.equal(oldLogin.statusCode, 401);
  assert.equal(newLogin.statusCode, 200);
});

test('reset-password rejects mismatched passwords, invalid tokens, and expired tokens', async () => {
  const mismatch = await responseFor(authController.resetPassword, {
    body: {
      token: 'b'.repeat(64),
      newPassword: 'NewSecurePassword123!',
      confirmPassword: 'DifferentPassword123!',
    },
  });
  assert.equal(mismatch.statusCode, 400);

  const invalid = await responseFor(authController.resetPassword, {
    body: {
      token: 'c'.repeat(64),
      newPassword: 'NewSecurePassword123!',
      confirmPassword: 'NewSecurePassword123!',
    },
  });
  assert.equal(invalid.statusCode, 400);

  const token = 'd'.repeat(64);
  adminRecord.passwordResetTokenHash = hashToken(token);
  adminRecord.passwordResetTokenExpiresAt = new Date(Date.now() - 1);
  const expired = await responseFor(authController.resetPassword, {
    body: {
      token,
      newPassword: 'NewSecurePassword123!',
      confirmPassword: 'NewSecurePassword123!',
    },
  });
  assert.equal(expired.statusCode, 400);
});

test('existing change-password flow keeps working and invalidates pending tokens and sessions', async () => {
  adminRecord.passwordResetTokenHash = hashToken('e'.repeat(64));
  adminRecord.passwordResetTokenExpiresAt = new Date(Date.now() + 60_000);
  adminRecord.pendingEmail = 'pending@example.com';
  adminRecord.emailChangeTokenHash = hashToken('f'.repeat(64));
  adminRecord.emailChangeTokenExpiresAt = new Date(Date.now() + 60_000);

  const result = await responseFor(authController.changePassword, {
    admin: { id: adminRecord._id },
    body: {
      currentPassword: 'PreviousPassword123!',
      newPassword: 'ChangedPassword123!',
    },
  });

  assert.equal(result.statusCode, 200);
  assert.equal(adminRecord.tokenVersion, 4);
  assert.equal(await bcrypt.compare('ChangedPassword123!', adminRecord.password), true);
  assert.equal('passwordResetTokenHash' in adminRecord, false);
  assert.equal('emailChangeTokenHash' in adminRecord, false);

  const oldLogin = await responseFor(authController.login, {
    body: { email: adminRecord.email, password: 'PreviousPassword123!' },
  });
  const newLogin = await responseFor(authController.login, {
    body: { email: adminRecord.email, password: 'ChangedPassword123!' },
  });
  assert.equal(oldLogin.statusCode, 401);
  assert.equal(newLogin.statusCode, 200);
});

test('email changes require the current password and verified ownership before taking effect', async () => {
  const incorrectPassword = await responseFor(
    authController.requestEmailChange,
    {
      admin: { id: adminRecord._id },
      body: {
        email: 'new@example.com',
        currentPassword: 'IncorrectPassword123!',
      },
    }
  );
  assert.equal(incorrectPassword.statusCode, 401);
  assert.equal(verificationEmails.length, 0);

  const request = await responseFor(authController.requestEmailChange, {
    admin: { id: adminRecord._id },
    body: {
      email: 'NEW@example.com',
      currentPassword: 'PreviousPassword123!',
    },
  });

  assert.equal(request.statusCode, 200);
  assert.equal(adminRecord.email, 'admin@example.com');
  assert.equal(adminRecord.pendingEmail, 'new@example.com');
  assert.equal(verificationEmails.length, 1);
  assert.equal(
    adminRecord.emailChangeTokenHash,
    hashToken(verificationEmails[0].token)
  );

  const confirmation = await responseFor(authController.confirmEmailChange, {
    body: { token: verificationEmails[0].token },
  });
  assert.equal(confirmation.statusCode, 200);
  assert.equal(adminRecord.email, 'new@example.com');
  assert.equal(adminRecord.tokenVersion, 4);
  assert.equal('emailChangeTokenHash' in adminRecord, false);

  const replay = await responseFor(authController.confirmEmailChange, {
    body: { token: verificationEmails[0].token },
  });
  assert.equal(replay.statusCode, 400);
});
