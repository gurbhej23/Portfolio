import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    issuer: { type: String, required: true, trim: true, maxlength: 160 },
    issueDate: { type: String, trim: true, maxlength: 40, default: '' },
    credentialUrl: { type: String, trim: true, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

certificationSchema.index({ order: 1, issueDate: -1 });

export const Certification = mongoose.model('Certification', certificationSchema);
