import { ContactMessage } from '../models/index.js';
import { sendReplyEmail } from '../services/email.service.js';
import { AppError } from '../utils/app-error.js';
import mongoose from 'mongoose';

export async function listMessages(req, res) {
  const filter = req.validatedQuery?.status ? { status: req.validatedQuery.status } : {};
  const messages = await ContactMessage.find(filter).select('-sourceIp -userAgent -emailNotificationError').sort({ createdAt: -1 }).limit(200).lean();
  res.json({ success: true, data: messages });
}

export async function updateMessageStatus(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) throw new AppError('Invalid message id.', 400);
  const message = await ContactMessage.findByIdAndUpdate(req.params.id, { status: req.body.status, read: req.body.status !== 'new' }, { new: true, runValidators: true }).lean();
  if (!message) throw new AppError('Message not found.', 404);
  res.json({ success: true, data: message });
}

export async function replyMessage(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) throw new AppError('Invalid message id.', 400);
  const { replyText } = req.body;

  const message = await ContactMessage.findById(req.params.id);
  if (!message) throw new AppError('Message not found.', 404);

  const emailResult = await sendReplyEmail({
    to: message.email,
    subject: message.subject,
    replyText,
    originalMessage: message.message,
  });

  message.replyText = replyText;
  message.repliedAt = new Date();
  message.status = 'replied';
  message.read = true;
  await message.save();

  res.json({
    success: true,
    data: {
      message,
      emailStatus: emailResult.status,
      emailError: emailResult.error,
    },
  });
}
