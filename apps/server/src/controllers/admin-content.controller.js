import { PortfolioContent } from '../models/index.js';

export async function getContent(req, res) {
  const content = await PortfolioContent.findOne({ key: 'main' }).lean();
  res.json({ success: true, data: content });
}

export async function updateContent(req, res) {
  const content = await PortfolioContent.findOneAndUpdate(
    { key: 'main' },
    { $set: req.body, $setOnInsert: { key: 'main' } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  ).lean();

  res.json({ success: true, data: content });
}
