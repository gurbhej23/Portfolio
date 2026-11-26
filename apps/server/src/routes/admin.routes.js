import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/async-handler.js';
import { validateBody, validateQuery } from '../middleware/validation.middleware.js';
import { Project, Skill, Experience, Education, Certification } from '../models/index.js';
import { createCrudHandlers } from '../controllers/admin-crud.controller.js';
import { getDashboardStats } from '../controllers/admin-dashboard.controller.js';
import { getContent, updateContent } from '../controllers/admin-content.controller.js';
import { uploadCertificationAttachment, uploadProfilePhoto, uploadProjectImage } from '../controllers/admin-media.controller.js';
import { uploadResumeFile } from '../controllers/admin-resume.controller.js';
import { listMessages, replyMessage, updateMessageStatus } from '../controllers/admin-message.controller.js';
import { resumeUpload } from '../middleware/resume-upload.middleware.js';
import { profilePhotoUpload, projectImageUpload } from '../middleware/image-upload.middleware.js';
import { certificateUpload } from '../middleware/certificate-upload.middleware.js';
import { projectBodySchema, projectUpdateSchema } from '../validators/project.validator.js';
import { certificationBodySchema, educationBodySchema, experienceBodySchema, messageQuerySchema, messageReplySchema, messageStatusSchema, portfolioContentBodySchema, skillBodySchema } from '../validators/admin.validator.js';

const router = Router();
router.use(authenticate, authorize('admin', 'editor'));
router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

const resources = [
  { path: 'projects', Model: Project, schema: projectBodySchema, updateSchema: projectUpdateSchema, sort: { featured: -1, order: 1, createdAt: -1 } },
  { path: 'skills', Model: Skill, schema: skillBodySchema },
  { path: 'experience', Model: Experience, schema: experienceBodySchema, sort: { order: 1, startDate: -1 } },
  { path: 'education', Model: Education, schema: educationBodySchema, sort: { order: 1, endDate: -1 } },
  { path: 'certifications', Model: Certification, schema: certificationBodySchema, sort: { order: 1, issueDate: -1 } },
];

router.get('/stats', asyncHandler(getDashboardStats));
router.get('/content', asyncHandler(getContent));
router.put('/content', validateBody(portfolioContentBodySchema), asyncHandler(updateContent));
router.post('/content/resume', resumeUpload.single('resume'), asyncHandler(uploadResumeFile));
router.post('/content/profile-photo', profilePhotoUpload.single('profilePhoto'), asyncHandler(uploadProfilePhoto));

for (const resource of resources) {
  const handlers = createCrudHandlers(resource.Model, resource.sort);
  router.get(`/${resource.path}`, asyncHandler(handlers.list));
  router.post(`/${resource.path}`, validateBody(resource.schema), asyncHandler(handlers.create));
  router.put(`/${resource.path}/:id`, validateBody(resource.updateSchema || resource.schema), asyncHandler(handlers.update));
  router.delete(`/${resource.path}/:id`, authorize('admin'), asyncHandler(handlers.remove));
}

router.post('/projects/:id/image', projectImageUpload.single('image'), asyncHandler(uploadProjectImage));
router.post('/certifications/:id/attachment', certificateUpload.single('certificate'), asyncHandler(uploadCertificationAttachment));

router.get('/messages', validateQuery(messageQuerySchema), asyncHandler(listMessages));
router.patch('/messages/:id/status', validateBody(messageStatusSchema), asyncHandler(updateMessageStatus));
router.post('/messages/:id/reply', validateBody(messageReplySchema), asyncHandler(replyMessage));

export default router;
