import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter;

function getTransporter() {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD || !env.CONTACT_RECEIVER) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
    });
  }
  return transporter;
}

export async function sendContactNotification(contactMessage) {
  const mailTransporter = getTransporter();
  if (!mailTransporter) return { status: 'not_configured', error: '' };

  try {
    await mailTransporter.sendMail({
      from: env.SMTP_FROM || env.SMTP_USER,
      to: env.CONTACT_RECEIVER,
      replyTo: contactMessage.email,
      subject: `[Portfolio contact] ${contactMessage.subject || 'New message'}`,
      text: [
        `Name: ${contactMessage.name}`,
        `Email: ${contactMessage.email}`,
        `Subject: ${contactMessage.subject || '(none)'}`,
        '',
        contactMessage.message,
      ].join('\n'),
    });
    return { status: 'sent', error: '' };
  } catch (error) {
    console.error('Contact notification email failed:', error.message);
    return { status: 'failed', error: error.message.slice(0, 500) };
  }
}

export async function sendReplyEmail({ to, subject, replyText, originalMessage }) {
  const mailTransporter = getTransporter();
  if (!mailTransporter) return { status: 'not_configured', error: '' };

  try {
    await mailTransporter.sendMail({
      from: env.SMTP_FROM || env.SMTP_USER,
      to,
      subject: subject && subject.startsWith('Re:') ? subject : `Re: ${subject || 'Portfolio message'}`,
      text: [
        replyText,
        '',
        '--- Original Message ---',
        originalMessage,
      ].join('\n'),
    });
    return { status: 'sent', error: '' };
  } catch (error) {
    console.error('Reply email failed:', error.message);
    return { status: 'failed', error: error.message.slice(0, 500) };
  }
}
