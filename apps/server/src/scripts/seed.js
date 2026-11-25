import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { PortfolioContent } from '../models/index.js';

const seed = async () => {
  await connectDatabase();

  const content = await PortfolioContent.findOneAndUpdate(
    { key: 'main' },
    { $setOnInsert: { key: 'main' } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  console.log(`Portfolio content document ready: ${content._id}`);
  await disconnectDatabase();
};

seed().catch(async (error) => {
  console.error('Unable to seed the database:', error.message);
  await disconnectDatabase();
  process.exit(1);
});
