require('dotenv').config();

const readline = require('readline');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const connectDB = require('../config/db');
const Admin = require('../models/Admin');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (!email) {
      throw new Error('Set ADMIN_EMAIL in server/.env first.');
    }

    await connectDB();

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log('An admin with this email already exists. No changes made.');
      return;
    }

    const password = await ask('Enter a strong admin password (minimum 12 characters): ');

    if (password.length < 12) {
      throw new Error('Password must be at least 12 characters long.');
    }

    const confirmation = await ask('Confirm password: ');

    if (password !== confirmation) {
      throw new Error('Passwords do not match.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await Admin.create({
      email,
      password: hashedPassword,
    });

    console.log(`Admin account created successfully for ${email}.`);
  } finally {
    rl.close();
    await mongoose.disconnect().catch(() => {});
  }
}

main().catch((error) => {
  console.error('Admin setup failed:', error.message);
  process.exitCode = 1;
});