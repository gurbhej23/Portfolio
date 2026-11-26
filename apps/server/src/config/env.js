import 'dotenv/config';
import { z } from 'zod';

const optionalString = z.preprocess((value) => value === '' ? undefined : value, z.string().optional());
const optionalEmail = z.preprocess((value) => value === '' ? undefined : value, z.string().email().optional());
const optionalUrl = z.preprocess((value) => value === '' ? undefined : value, z.string().url().optional());
const optionalPassword = z.preprocess((value) => value === '' ? undefined : value, z.string().min(12).optional());
const optionalBoolean = z.preprocess((value) => value === undefined ? undefined : value === 'true', z.boolean().optional());

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'),
  PUBLIC_API_URL: optionalUrl,
  MONGODB_URI: z.string().min(1).default('mongodb://127.0.0.1:27017/gurbhej_portfolio'),
  MONGODB_SERVER_SELECTION_TIMEOUT_MS: z.coerce.number().int().positive().default(5000),
  ALLOW_START_WITHOUT_DB: optionalBoolean,
  JWT_SECRET: z.string().min(32).default('development-only-secret-change-me-please'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  COOKIE_NAME: z.string().min(1).default('portfolio_token'),
  RESEND_API_KEY: optionalString,
  SMTP_HOST: optionalString,
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: optionalString,
  SMTP_PASSWORD: optionalString,
  SMTP_FROM: optionalEmail,
  CONTACT_RECEIVER: optionalEmail,
  SEED_ADMIN_EMAIL: optionalEmail,
  SEED_ADMIN_PASSWORD: optionalPassword,
}).superRefine((values, ctx) => {
  if (values.NODE_ENV === 'production' && values.JWT_SECRET === 'development-only-secret-change-me-please') {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['JWT_SECRET'], message: 'JWT_SECRET must be explicitly configured in production.' });
  }
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment configuration:', parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsedEnv.data;
