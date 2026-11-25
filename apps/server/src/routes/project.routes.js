import { Router } from 'express';
import { getProjectBySlug, listProjects } from '../controllers/project.controller.js';
import { validateQuery } from '../middleware/validation.middleware.js';
import { asyncHandler } from '../utils/async-handler.js';
import { projectQuerySchema } from '../validators/project.validator.js';

const router = Router();

router.get('/', validateQuery(projectQuerySchema), asyncHandler(listProjects));
router.get('/:slug', asyncHandler(getProjectBySlug));

export default router;
