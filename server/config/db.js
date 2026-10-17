const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI =
    process.env.MONGO_URI ||
    (process.env.NODE_ENV === 'production'
      ? ''
      : 'mongodb://localhost:27017/startup_cafe');

  if (!mongoURI) {
    throw new Error('MONGO_URI must be configured in production.');
  }

  const conn = await mongoose.connect(mongoURI);
  console.log(
    `[MongoDB] Database connected successfully: ${conn.connection.host}`
  );
  return conn;
};

module.exports = connectDB;
