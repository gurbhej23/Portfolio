import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 40 },
    url: { type: String, required: true, trim: true, maxlength: 500 },
    icon: { type: String, trim: true, maxlength: 40, default: '' },
  },
  { _id: false },
);

const portfolioContentSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: 'main' },
    hero: {
      headline: { type: String, trim: true, maxlength: 160, default: '' },
      role: { type: String, trim: true, maxlength: 120, default: '' },
      roles: { type: [String], default: [] },
      introduction: { type: String, trim: true, maxlength: 1000, default: '' },
      primaryCtaLabel: { type: String, trim: true, maxlength: 80, default: '' },
      primaryCtaUrl: { type: String, trim: true, maxlength: 500, default: '' },
    },
    about: {
      summary: { type: String, trim: true, maxlength: 3000, default: '' },
      journey: { type: String, trim: true, maxlength: 5000, default: '' },
    },
    contact: {
      email: { type: String, trim: true, lowercase: true, default: '' },
      location: { type: String, trim: true, maxlength: 160, default: '' },
      availability: { type: String, trim: true, maxlength: 500, default: '' },
    },
    resumeUrl: { type: String, trim: true, default: '' },
    profilePhotoUrl: { type: String, trim: true, default: '' },
    socialLinks: { type: [socialLinkSchema], default: [] },
  },
  { timestamps: true },
);

export const PortfolioContent = mongoose.model('PortfolioContent', portfolioContentSchema);
