const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(
      `Startup Cafe API Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
    );
  });

  process.on('unhandledRejection', (error) => {
    console.error('[Server] Unhandled promise rejection.', {
      name: error.name,
      code: error.code,
    });
    server.close(() => process.exit(1));
  });
};

startServer().catch((error) => {
  console.error('[Server] Startup failed.', {
    name: error.name,
    code: error.code,
  });
  process.exitCode = 1;
});
