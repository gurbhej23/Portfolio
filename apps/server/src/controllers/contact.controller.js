import { ContactMessage } from '../models/index.js';
import { sendContactNotification } from '../services/email.service.js';
import { AppError } from '../utils/app-error.js';

export async function createContactMessage(req, res) {
  const { website, ...messageData } = req.body;
  if (website) throw new AppError('Unable to process this request.', 400);

  const recentDuplicate = await ContactMessage.exists({
    email: messageData.email,
    message: messageData.message,
    createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) },
  });
  if (recentDuplicate) throw new AppError('Please wait before sending the same message again.', 429);

  const contactMessage = await ContactMessage.create({
    ...messageData,
    sourceIp: req.ip,
    userAgent: req.get('user-agent') || '',
  });

  const notification = await sendContactNotification(contactMessage);
  try {
    await ContactMessage.findByIdAndUpdate(contactMessage._id, {
      emailNotificationStatus: notification.status,
      emailNotificationError: notification.error,
    });
  } catch (error) {
    console.error('Unable to record contact notification status:', error.message);
  }

  res.status(201).json({
    success: true,
    data: {
      id: contactMessage._id,
      message: 'Your message was received.',
    },
  });
}
