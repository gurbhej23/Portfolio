import { Project } from '../models/index.js';
import { AppError } from '../utils/app-error.js';
import { env } from '../config/env.js';

function normalizeProjectMedia(project, req) {
  const requestApiUrl = `${req.protocol}://${req.get('host')}`.replace(/\/+$/, '');
  const configuredApiUrl = (env.PUBLIC_API_URL || '').replace(/\/api\/?$/i, '').replace(/\/+$/, '');
  const configuredUrlIsLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(?::\d+)?$/i.test(configuredApiUrl);
  const publicApiUrl = configuredApiUrl && !(env.NODE_ENV === 'production' && configuredUrlIsLocal)
    ? configuredApiUrl
    : requestApiUrl;
  const replaceMediaUrl = (url) => {
    if (!url || typeof url !== 'string') return url;
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(?::\d+)?/i.test(url)) {
      return url.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(?::\d+)?/i, publicApiUrl);
    }
    if (url.startsWith('/uploads/')) return `${publicApiUrl}${url}`;
    return url;
  };

  return {
    ...project,
    imageUrl: replaceMediaUrl(project.imageUrl),
    thumbnail: replaceMediaUrl(project.thumbnail),
    images: Array.isArray(project.images) ? project.images.map(replaceMediaUrl) : [],
  };
}

export async function listProjects(req, res) {
  const filters = { published: true };
  const query = req.validatedQuery || {};

  if (query.featured !== undefined) {
    filters.featured = query.featured === 'true';
  }

  const projects = await Project.find(filters).sort({ featured: -1, order: 1, createdAt: -1 }).lean();

  res.json({ success: true, data: projects.map((project) => normalizeProjectMedia(project, req)) });
}

export async function getProjectBySlug(req, res) {
  const project = await Project.findOne({ slug: req.params.slug, published: true }).lean();

  if (!project) {
    throw new AppError('Project not found.', 404);
  }

  res.json({ success: true, data: normalizeProjectMedia(project, req) });
}
