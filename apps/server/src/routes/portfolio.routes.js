import { Router } from 'express';
import { getPortfolio } from '../controllers/portfolio.controller.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();

router.get('/', asyncHandler(getPortfolio));

export default router;
