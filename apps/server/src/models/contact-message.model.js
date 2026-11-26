import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    subject: { type: String, trim: true, maxlength: 180, default: '' },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new',
      index: true,
    },
    read: { type: Boolean, default: false, index: true },
    replyText: { type: String, trim: true, maxlength: 5000, default: '' },
    repliedAt: { type: Date },
    sourceIp: { type: String, trim: true, maxlength: 64, default: '' },
    userAgent: { type: String, trim: true, maxlength: 500, default: '' },
    emailNotificationStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'not_configured'],
      default: 'pending',
    },
    emailNotificationError: { type: String, trim: true, maxlength: 500, default: '' },
  },
  { timestamps: true },
);

contactMessageSchema.index({ createdAt: -1 });

export const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
