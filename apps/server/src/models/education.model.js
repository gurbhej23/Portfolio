import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true, trim: true, maxlength: 160 },
    degree: { type: String, required: true, trim: true, maxlength: 160 },
    field: { type: String, trim: true, maxlength: 120, default: '' },
    startDate: { type: String, trim: true, maxlength: 40, default: '' },
    endDate: { type: String, trim: true, maxlength: 40, default: '' },
    description: { type: String, trim: true, maxlength: 3000, default: '' },
    order: { type: Number, default: 0 },
    source: { type: String, enum: ['manual', 'resume'], default: 'manual', index: true },
  },
  { timestamps: true },
);

educationSchema.index({ order: 1, endDate: -1 });

export const Education = mongoose.model('Education', educationSchema);
