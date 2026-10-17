
const nodemailer = require('nodemailer');

let transporter;

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (character) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });

const getAdminLink = (path, token) => {
  const adminUrl = process.env.ADMIN_URL;

  if (!adminUrl) {
    const error = new Error('ADMIN_URL is not configured.');
    error.code = 'EMAIL_CONFIG';
    throw error;
  }

  const link = new URL(path, adminUrl);

  if (
    !['http:', 'https:'].includes(link.protocol) ||
    (process.env.NODE_ENV === 'production' &&
      link.protocol !== 'https:')
  ) {
    const error = new Error('ADMIN_URL must use HTTPS in production.');
    error.code = 'EMAIL_CONFIG';
    throw error;
  }

  link.searchParams.set('token', token);
  return link.toString();
};

// Use Gmail SMTP for all outgoing emails.
const createTransporter = () => {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    const error = new Error('Gmail SMTP credentials are not configured.');
    error.code = 'EMAIL_CONFIG';
    throw error;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });
  }

  return transporter;
};

const getEmailFailureDetails = (error) => {
  const code =
    typeof error?.code === 'string' && /^[A-Z0-9_-]{1,32}$/i.test(error.code)
      ? error.code
      : 'UNKNOWN';
  const responseCode = Number.isInteger(error?.responseCode)
    ? error.responseCode
    : undefined;

  if (code === 'EMAIL_CONFIG') {
    return {
      code,
      action: 'Check server/.env for GMAIL_USER, GMAIL_APP_PASSWORD, ADMIN_URL, and NOTIFICATION_EMAIL.',
    };
  }

  if (code === 'EAUTH' || [534, 535].includes(responseCode)) {
    return {
      code,
      responseCode,
      action: 'Check the Gmail account, enable 2-Step Verification, and create a valid Google app password.',
    };
  }

  if (
    ['ECONNECTION', 'ECONNREFUSED', 'ENOTFOUND', 'ESOCKET', 'ETIMEDOUT'].includes(
      code
    )
  ) {
    return {
      code,
      action: 'Check outbound SMTP connectivity and whether the host permits Gmail SMTP connections.',
    };
  }

  if ([550, 551, 553].includes(responseCode)) {
    return {
      code,
      responseCode,
      action: 'Check the configured sender and recipient addresses and Gmail account sending restrictions.',
    };
  }

  const details = { code };
  if (responseCode) details.responseCode = responseCode;
  if (typeof error?.command === 'string') {
    const command = error.command.match(
      /^(AUTH|EHLO|HELO|STARTTLS|MAIL|RCPT|DATA|QUIT|CONNECT)(?:\s|$)/i
    );
    if (command) details.command = command[1].toUpperCase();
  }
  details.action =
    'Run `npm run email:verify` from the server package and check Gmail SMTP account settings.';
  return details;
};

const logEmailFailure = (workflow, error) => {
  console.error(`[Email] ${workflow} failed.`, getEmailFailureDetails(error));
};

const sendAdminEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `Startup Cafe <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
    text,
  });
};

const verifyEmailTransport = async () => {
  const smtpTransport = createTransporter();
  await smtpTransport.verify();
};

const sendPasswordResetEmail = async (email, token) => {
  const resetLink = getAdminLink('/reset-password', token);
  const escapedResetLink = escapeHtml(resetLink);

  await sendAdminEmail({
    to: email,
    subject: 'Reset your Startup Cafe admin password',
    text: `We received a request to reset your Startup Cafe admin password. Open this link within 30 minutes to choose a new password: ${resetLink}\n\nIf you did not request this, you can ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:560px;margin:24px auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;color:#202a25">
        <div style="background:#202a25;padding:24px;color:#fff">
          <strong style="font-size:20px">Startup Cafe</strong>
          <div style="font-size:12px;letter-spacing:2px;color:#d1d5db">ADMIN PASSWORD RESET</div>
        </div>
        <div style="padding:24px">
          <h1 style="font-size:22px;margin:0 0 12px">Choose a new password</h1>
          <p>We received a request to reset the password for your admin account. Use the secure link below within 30 minutes.</p>
          <p style="margin:28px 0">
            <a href="${escapedResetLink}" style="display:inline-block;background:#a72b6c;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Reset password</a>
          </p>
          <p style="font-size:13px;color:#6b7280">If you did not request a reset, ignore this email. The link can only be used once.</p>
        </div>
      </div>
    `,
  });
};

const sendEmailChangeVerificationEmail = async (email, token) => {
  const verificationLink = getAdminLink('/verify-email', token);
  const escapedVerificationLink = escapeHtml(verificationLink);

  await sendAdminEmail({
    to: email,
    subject: 'Verify your new Startup Cafe admin email',
    text: `Verify this email address for your Startup Cafe admin account within 30 minutes: ${verificationLink}\n\nIf you did not request this change, you can ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:560px;margin:24px auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;color:#202a25">
        <div style="background:#202a25;padding:24px;color:#fff">
          <strong style="font-size:20px">Startup Cafe</strong>
          <div style="font-size:12px;letter-spacing:2px;color:#d1d5db">ADMIN EMAIL VERIFICATION</div>
        </div>
        <div style="padding:24px">
          <h1 style="font-size:22px;margin:0 0 12px">Verify your new email</h1>
          <p>Confirm that you own this address to finish updating the email used to sign in to the Startup Cafe admin panel.</p>
          <p style="margin:28px 0">
            <a href="${escapedVerificationLink}" style="display:inline-block;background:#a72b6c;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Verify email address</a>
          </p>
          <p style="font-size:13px;color:#6b7280">This link expires in 30 minutes and can only be used once. If you did not request this change, ignore this email.</p>
        </div>
      </div>
    `,
  });
};

const sendLeadNotificationEmail = async (lead) => {
  const safeName = escapeHtml(lead.fullName);
  const safePhone = escapeHtml(lead.phone);
  const safeEmail = escapeHtml(lead.email);
  const safeWorkspace = escapeHtml(lead.workspaceType);
  const safeMessage = escapeHtml(lead.message || 'No message provided.');
  const phoneDigits = String(lead.phone || '').replace(/\D/g, '');
  const createdAt = new Date(
    lead.createdAt || Date.now()
  ).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
  });

  const notificationEmail = process.env.NOTIFICATION_EMAIL;

  if (!notificationEmail) {
    const error = new Error('NOTIFICATION_EMAIL is not configured.');
    error.code = 'EMAIL_CONFIG';
    throw error;
  }

  await sendAdminEmail({
    to: notificationEmail,
    subject: 'New Lead Inquiry — Startup Cafe',
    text: [
      'Startup Cafe — New Booking Inquiry',
      `Name: ${lead.fullName}`,
      `Phone: ${lead.phone}`,
      `Email: ${lead.email}`,
      `Workspace: ${lead.workspaceType}`,
      `Message: ${lead.message || 'No message provided.'}`,
      `Date/Time: ${createdAt}`,
    ].join('\n'),
    html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;border:1px solid #e9e2d8;border-radius:12px;overflow:hidden">
          <div style="background:#FFDE4D;color:#000;padding:20px;font-weight:bold;font-size:20px;text-align:center">
            Startup Cafe Gorakhpur — New Booking Inquiry
          </div>
          <div style="padding:24px;background:#fff">
            <p>You have received a new booking inquiry:</p>
            <table style="width:100%;border-collapse:collapse;margin:20px 0">
              <tr><td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold">Full Name</td><td style="padding:10px;border-bottom:1px solid #eee">${safeName}</td></tr>
              <tr><td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold">Phone</td><td style="padding:10px;border-bottom:1px solid #eee">${safePhone}</td></tr>
              <tr><td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold">Email</td><td style="padding:10px;border-bottom:1px solid #eee">${safeEmail}</td></tr>
              <tr><td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold">Workspace</td><td style="padding:10px;border-bottom:1px solid #eee">${safeWorkspace}</td></tr>
              <tr><td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold">Message</td><td style="padding:10px;border-bottom:1px solid #eee">${safeMessage}</td></tr>
              <tr><td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold">Date/Time</td><td style="padding:10px;border-bottom:1px solid #eee">${escapeHtml(createdAt)}</td></tr>
            </table>
            ${
              phoneDigits
                ? `<p><a href="https://wa.me/91${phoneDigits}">Contact on WhatsApp</a></p>`
                : ''
            }
          </div>
        </div>
      `,
  });
};

module.exports = {
  sendLeadNotificationEmail,
  sendPasswordResetEmail,
  sendEmailChangeVerificationEmail,
  verifyEmailTransport,
  logEmailFailure,
  getEmailFailureDetails,
};
