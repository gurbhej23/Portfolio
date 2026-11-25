import app from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';

const startServer = async () => {
  try {
    await connectDatabase();
  } catch (error) {
    const allowStartWithoutDatabase = env.ALLOW_START_WITHOUT_DB ?? env.NODE_ENV !== 'production';
    if (!allowStartWithoutDatabase) throw error;
    console.warn(`MongoDB unavailable. Starting in degraded mode: ${error.message}`);
  }

  const server = app.listen(env.PORT, () => {
    console.log(`Portfolio API listening on http://localhost:${env.PORT}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down gracefully.`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
};

startServer().catch((error) => {
  console.error('Unable to start the Portfolio API:', error.message);
  process.exit(1);
});
