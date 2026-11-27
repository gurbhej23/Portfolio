import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter;

function getTransporter() {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD) return null;
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

async function sendViaResend({ to, from, subject, text, replyTo }) {
  if (!env.RESEND_API_KEY) return null;
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from || env.SMTP_FROM || 'Portfolio <onboarding@resend.dev>',
        to: Array.isArray(to) ? to : [to],
        reply_to: replyTo,
        subject,
        text,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Resend API error');
    return { status: 'sent', error: '' };
  } catch (error) {
    console.error('Resend delivery failed:', error.message);
    return { status: 'failed', error: error.message.slice(0, 500) };
  }
}

export async function sendContactNotification(contactMessage) {
  const receiver = env.CONTACT_RECEIVER || env.SMTP_USER;

  const mailTransporter = getTransporter();
  if (mailTransporter && receiver) {
    try {
      await mailTransporter.sendMail({
        from: env.SMTP_FROM || env.SMTP_USER,
        to: receiver,
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

  if (env.RESEND_API_KEY && receiver) {
    return sendViaResend({
      to: receiver,
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
  }

  return { status: 'not_configured', error: '' };
}

export async function sendReplyEmail({ to, subject, replyText, originalMessage }) {
  const emailSubject = subject && subject.startsWith('Re:') ? subject : `Re: ${subject || 'Portfolio message'}`;
  const fullText = [replyText, '', '--- Original Message ---', originalMessage].join('\n');

  if (env.RESEND_API_KEY) {
    return sendViaResend({
      to,
      subject: emailSubject,
      text: fullText,
    });
  }

  const mailTransporter = getTransporter();
  if (!mailTransporter) return { status: 'not_configured', error: '' };

  try {
    await mailTransporter.sendMail({
      from: env.SMTP_FROM || env.SMTP_USER,
      to,
      subject: emailSubject,
      text: fullText,
    });
    return { status: 'sent', error: '' };
  } catch (error) {
    console.error('Reply email failed:', error.message);
    return { status: 'failed', error: error.message.slice(0, 500) };
  }
}
