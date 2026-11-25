import { Certification, Education, Experience, PortfolioContent, Project, Skill } from '../models/index.js';

export async function getPortfolio(req, res) {
  const [content, projects, skills, experience, education, certifications] = await Promise.all([
    PortfolioContent.findOne({ key: 'main' }).lean(),
    Project.find({ published: true }).sort({ featured: -1, order: 1, createdAt: -1 }).lean(),
    Skill.find().sort({ category: 1, order: 1, name: 1 }).lean(),
    Experience.find().sort({ order: 1, startDate: -1 }).lean(),
    Education.find().sort({ order: 1, endDate: -1 }).lean(),
    Certification.find().sort({ order: 1, issueDate: -1 }).lean(),
  ]);

  res.json({
    success: true,
    data: { content, projects, skills, experience, education, certifications },
  });
}
