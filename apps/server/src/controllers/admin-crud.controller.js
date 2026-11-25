import mongoose from 'mongoose';
import { AppError } from '../utils/app-error.js';

function getId(req) {
  if (!mongoose.isValidObjectId(req.params.id)) throw new AppError('Invalid record id.', 400);
  return req.params.id;
}

export function createCrudHandlers(Model, sort = { order: 1, createdAt: -1 }) {
  return {
    list: async (req, res) => {
      const records = await Model.find().sort(sort).lean();
      res.json({ success: true, data: records });
    },
    create: async (req, res) => {
      const record = await Model.create(req.body);
      res.status(201).json({ success: true, data: record });
    },
    update: async (req, res) => {
      const record = await Model.findByIdAndUpdate(getId(req), { $set: req.body }, { new: true, runValidators: true }).lean();
      if (!record) throw new AppError('Record not found.', 404);
      res.json({ success: true, data: record });
    },
    remove: async (req, res) => {
      const record = await Model.findByIdAndDelete(getId(req)).lean();
      if (!record) throw new AppError('Record not found.', 404);
      res.json({ success: true, data: { id: record._id } });
    },
  };
}
