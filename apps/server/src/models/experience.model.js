import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true, maxlength: 120 },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    employmentType: { type: String, trim: true, maxlength: 60, default: '' },
    location: { type: String, trim: true, maxlength: 120, default: '' },
    startDate: { type: String, trim: true, maxlength: 40, default: '' },
    endDate: { type: String, trim: true, maxlength: 40, default: '' },
    current: { type: Boolean, default: false },
    description: { type: String, trim: true, maxlength: 5000, default: '' },
    highlights: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    source: { type: String, enum: ['manual', 'resume'], default: 'manual', index: true },
  },
  { timestamps: true },
);

experienceSchema.index({ order: 1, startDate: -1 });

export const Experience = mongoose.model('Experience', experienceSchema);
