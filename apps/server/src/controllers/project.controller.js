import { Project } from '../models/index.js';
import { AppError } from '../utils/app-error.js';

export async function listProjects(req, res) {
  const filters = { published: true };
  const query = req.validatedQuery || {};

  if (query.featured !== undefined) {
    filters.featured = query.featured === 'true';
  }

  const projects = await Project.find(filters).sort({ featured: -1, order: 1, createdAt: -1 }).lean();

  res.json({ success: true, data: projects });
}

export async function getProjectBySlug(req, res) {
  const project = await Project.findOne({ slug: req.params.slug, published: true }).lean();

  if (!project) {
    throw new AppError('Project not found.', 404);
  }

  res.json({ success: true, data: project });
}
