import { z } from 'zod';
import { sanitizePlainText } from '../utils/sanitize.js';

const contactText = (schema) => z.preprocess(sanitizePlainText, schema);

export const contactBodySchema = z.object({
  name: contactText(z.string().min(2).max(120)),
  email: contactText(z.string().email().max(254)).transform((value) => value.toLowerCase()),
  subject: contactText(z.string().max(180)).default(''),
  message: contactText(z.string().min(10).max(5000)),
  website: z.string().max(0).default(''),
});
