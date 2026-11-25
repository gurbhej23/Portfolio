import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 40,
    },
    proficiency: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    order: {
      type: Number,
      default: 0,
    },
    source: {
      type: String,
      enum: ['manual', 'resume'],
      default: 'manual',
      index: true,
    },
  },
  { timestamps: true },
);

skillSchema.index({ category: 1, order: 1 });

export const Skill = mongoose.model('Skill', skillSchema);
