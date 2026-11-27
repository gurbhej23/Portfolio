import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 140,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    category: {
      type: String,
      trim: true,
      maxlength: 40,
      default: 'Other',
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    fullDescription: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: '',
    },
    overview: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: '',
    },
    problem: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: '',
    },
    solutions: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
    contributions: {
      type: [String],
      default: [],
    },
    challenges: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: '',
    },
    learnings: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    thumbnail: {
      type: String,
      trim: true,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    liveUrl: {
      type: String,
      trim: true,
      default: '',
    },
    liveDemoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
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

projectSchema.index({ published: 1, featured: -1, order: 1 });

export const Project = mongoose.model('Project', projectSchema);
