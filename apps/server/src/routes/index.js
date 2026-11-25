import { Router } from 'express';
import contactRoutes from './contact.routes.js';
import healthRoutes from './health.routes.js';
import portfolioRoutes from './portfolio.routes.js';
import projectRoutes from './project.routes.js';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import { requireDatabase } from '../middleware/database.middleware.js';

const router = Router();

router.use('/health', healthRoutes);
router.use(requireDatabase);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/projects', projectRoutes);
router.use('/contact', contactRoutes);

export default router;
