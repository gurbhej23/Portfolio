import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import { env } from './config/env.js';
import { uploadsDirectory } from './config/uploads.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import apiRoutes from './routes/index.js';

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  if (origin === env.CLIENT_ORIGIN) return true;
  if (/^https:\/\/[a-z0-9._-]+\.vercel\.app$/i.test(origin)) return true;
  return false;
};

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', env.NODE_ENV === 'production' ? 1 : false);
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  }),
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 120,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    // React Strict Mode and Vite reloads can repeat requests during local development.
    skip: () => env.NODE_ENV !== 'production',
  }),
);
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(hpp());
app.use('/uploads/resumes', (req, res, next) => {
  if (req.query.download === '1') res.attachment('gurbhej-singh-resume.pdf');
  next();
});
app.use('/uploads', (req, res, next) => {
  // The Vite client and API use different local origins during development.
  // Limit this relaxed policy to public portfolio media only.
  res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(uploadsDirectory, { dotfiles: 'deny', index: false, maxAge: '1d' }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    service: 'portfolio-api',
    message: 'Portfolio API is running.',
  });
});

app.use('/api', apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
