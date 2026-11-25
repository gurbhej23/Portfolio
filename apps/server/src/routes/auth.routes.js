import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate } from '../middleware/auth.middleware.js';
import { currentUser, login, logout } from '../controllers/auth.controller.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { asyncHandler } from '../utils/async-handler.js';
import { loginBodySchema } from '../validators/auth.validator.js';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  // Only failed login attempts count toward the brute-force limit. A valid
  // login should not make the next legitimate login look like an attack.
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
});

const router = Router();

router.post('/login', loginLimiter, validateBody(loginBodySchema), asyncHandler(login));
router.post('/logout', authenticate, asyncHandler(logout));
router.get('/me', authenticate, asyncHandler(currentUser));

export default router;
