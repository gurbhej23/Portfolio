import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { env } from '../config/env.js';
import { AdminUser } from '../models/index.js';

async function createAdmin() {
  if (!env.SEED_ADMIN_EMAIL || !env.SEED_ADMIN_PASSWORD) {
    throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set for admin:create.');
  }

  await connectDatabase();
  const existingUser = await AdminUser.exists({ email: env.SEED_ADMIN_EMAIL });
  if (existingUser) {
    throw new Error('An admin account with this email already exists. No changes were made.');
  }

  const passwordHash = await bcrypt.hash(env.SEED_ADMIN_PASSWORD, 12);
  await AdminUser.create({ email: env.SEED_ADMIN_EMAIL, passwordHash, role: 'admin' });
  console.log(`Initial admin account created for ${env.SEED_ADMIN_EMAIL}.`);
}

createAdmin()
  .then(async () => { await disconnectDatabase(); })
  .catch(async (error) => {
    console.error('Unable to create initial admin:', error.message);
    await disconnectDatabase();
    process.exit(1);
  });
