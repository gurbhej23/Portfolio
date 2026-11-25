import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createContactMessage } from '../controllers/contact.controller.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { asyncHandler } from '../utils/async-handler.js';
import { contactBodySchema } from '../validators/contact.validator.js';

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many contact attempts. Please try again later.' },
});

const router = Router();

router.post('/', contactLimiter, validateBody(contactBodySchema), asyncHandler(createContactMessage));

export default router;
