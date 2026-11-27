import { Certification, Education, Experience, PortfolioContent, Project, Skill } from '../models/index.js';
import { env } from '../config/env.js';

export async function getPortfolio(req, res) {
  const [content, projects, skills, experience, education, certifications] = await Promise.all([
    PortfolioContent.findOne({ key: 'main' }).lean(),
    Project.find({ published: true }).sort({ featured: -1, order: 1, createdAt: -1 }).lean(),
    Skill.find().sort({ category: 1, order: 1, name: 1 }).lean(),
    Experience.find().sort({ order: 1, startDate: -1 }).lean(),
    Education.find().sort({ order: 1, endDate: -1 }).lean(),
    Certification.find().sort({ order: 1, issueDate: -1 }).lean(),
  ]);

  const requestApiUrl = `${req.protocol}://${req.get('host')}`.replace(/\/+$/, '');
  const configuredApiUrl = (env.PUBLIC_API_URL || '').replace(/\/api\/?$/i, '').replace(/\/+$/, '');
  const configuredUrlIsLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(?::\d+)?$/i.test(configuredApiUrl);
  const publicApiUrl = (configuredApiUrl && !(env.NODE_ENV === 'production' && configuredUrlIsLocal)
    ? configuredApiUrl
    : requestApiUrl);

  const replaceLocalhost = (url) => {
    if (!url || typeof url !== 'string') return url;
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(?::\d+)?/i.test(url)) {
      return url.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(?::\d+)?/i, publicApiUrl);
    }
    if (url.startsWith('/uploads/')) {
      return `${publicApiUrl}${url}`;
    }
    return url;
  };

  if (content) {
    if (content.profilePhotoUrl) content.profilePhotoUrl = replaceLocalhost(content.profilePhotoUrl);
    if (content.resumeUrl) content.resumeUrl = replaceLocalhost(content.resumeUrl);
  }

  const normalizedProjects = projects.map((p) => ({
    ...p,
    imageUrl: replaceLocalhost(p.imageUrl),
    thumbnail: replaceLocalhost(p.thumbnail),
    images: Array.isArray(p.images) ? p.images.map(replaceLocalhost) : [],
  }));

  const normalizedCertifications = certifications.map((c) => ({
    ...c,
    attachmentUrl: replaceLocalhost(c.attachmentUrl),
  }));

  res.json({
    success: true,
    data: { content, projects: normalizedProjects, skills, experience, education, certifications: normalizedCertifications },
  });
}
