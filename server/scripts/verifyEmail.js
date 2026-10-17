const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { verifyEmailTransport, logEmailFailure } = require('../utils/email');

const main = async () => {
  try {
    await verifyEmailTransport();
    console.log('[Email] Gmail SMTP transport verified successfully.');
  } catch (error) {
    logEmailFailure('SMTP transport verification', error);
    console.error(
      '[Email] Verification failed. Follow the action in the diagnostic above.'
    );
    process.exitCode = 1;
  }
};

main();
