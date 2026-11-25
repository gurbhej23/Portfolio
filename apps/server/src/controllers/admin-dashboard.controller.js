import { Certification, ContactMessage, Education, Experience, Project, Skill } from '../models/index.js';

export async function getDashboardStats(req, res) {
  const [projects, featuredProjects, skills, experience, education, certifications, unreadMessages] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ featured: true, published: true }),
    Skill.countDocuments(),
    Experience.countDocuments(),
    Education.countDocuments(),
    Certification.countDocuments(),
    ContactMessage.countDocuments({ status: 'new' }),
  ]);

  res.json({ success: true, data: { projects, featuredProjects, skills, experience, education, certifications, unreadMessages } });
}
