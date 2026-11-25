import { readFile } from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';
import { Education, Experience, PortfolioContent, Project, Skill } from '../models/index.js';
import { parseResumeText, slugify } from './resume-parser.js';

async function extractPdfText(filePath) {
  const parser = new PDFParse({ data: await readFile(filePath) });
  try {
    const result = await parser.getText();
    return result.text || '';
  } finally {
    await parser.destroy();
  }
}

function uniqueProjectSlug(base, occupied) {
  const root = slugify(base);
  let candidate = root;
  let suffix = 2;
  while (occupied.has(candidate)) {
    candidate = `${root}-${suffix}`;
    suffix += 1;
  }
  occupied.add(candidate);
  return candidate;
}

async function replaceImportedRecords(Model, records) {
  await Model.deleteMany({ source: 'resume' });
  if (records.length) await Model.insertMany(records);
}

export async function importResumeFile(filePath, resumeUrl) {
  const text = await extractPdfText(filePath);
  if (!text.trim()) {
    const error = new Error('The PDF does not contain readable text. Upload a text-based PDF resume.');
    error.statusCode = 422;
    error.expose = true;
    throw error;
  }

  const parsed = parseResumeText(text);
  const occupiedSlugs = new Set((await Project.find({ source: { $ne: 'resume' } }).select('slug').lean()).map((project) => project.slug));
  const projects = parsed.projects.map((project) => ({ ...project, slug: uniqueProjectSlug(project.slug, occupiedSlugs) }));
  const contentUpdates = { resumeUrl };

  Object.entries({
    'hero.headline': parsed.hero.headline,
    'hero.role': parsed.hero.role,
    'hero.roles': parsed.hero.roles,
    'hero.introduction': parsed.hero.introduction,
    'about.summary': parsed.about.summary,
    'about.journey': parsed.about.journey,
    'contact.email': parsed.contact.email,
    'contact.location': parsed.contact.location,
  }).forEach(([path, value]) => {
    if ((Array.isArray(value) && value.length) || (typeof value === 'string' && value.trim())) {
      contentUpdates[path] = value;
    }
  });

  await replaceImportedRecords(Project, projects);
  await replaceImportedRecords(Skill, parsed.skills);
  await replaceImportedRecords(Experience, parsed.experience);
  await replaceImportedRecords(Education, parsed.education);

  const content = await PortfolioContent.findOneAndUpdate(
    { key: 'main' },
    {
      $set: contentUpdates,
      $setOnInsert: { key: 'main' },
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  ).lean();

  return {
    content,
    imported: {
      skills: parsed.skills.length,
      projects: projects.length,
      experience: parsed.experience.length,
      education: parsed.education.length,
    },
  };
}
