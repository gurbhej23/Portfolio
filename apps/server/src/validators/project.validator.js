import { z } from 'zod';

const optionalUrl = z
  .string()
  .trim()
  .url('Must be a valid URL.')
  .or(z.literal(''))
  .default('');

const optionalSlug = z
  .string()
  .trim()
  .max(140)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must use lowercase letters, numbers, and hyphens.')
  .or(z.literal(''))
  .default('');

const optionalSummary = z.string().trim().max(300).default('');
const optionalLongText = z.string().trim().max(5000).default('');
const optionalMediumText = z.string().trim().max(3000).default('');
const optionalShortText = z.string().trim().max(1000).default('');
const textArray = z.array(z.string().trim().min(1).max(500)).max(40).default([]);
const mediaUrl = z
  .string()
  .trim()
  .max(1000)
  .refine((value) => value === '' || value.startsWith('/') || /^https?:\/\//i.test(value), 'Must be a valid media URL.')
  .default('');
const mediaUrls = z.array(mediaUrl).max(30).default([]);

const projectFieldsSchema = z.object({
  title: z.string().trim().min(1).max(120),
  slug: optionalSlug,
  category: z.string().trim().min(1).max(40).default('Other'),
  summary: optionalSummary,
  shortDescription: optionalSummary,
  description: optionalLongText,
  fullDescription: optionalLongText,
  overview: optionalMediumText,
  problem: optionalMediumText,
  solutions: textArray,
  role: optionalShortText,
  contributions: textArray,
  challenges: optionalMediumText,
  learnings: textArray,
  imageUrl: optionalUrl,
  thumbnail: mediaUrl,
  images: mediaUrls,
  technologies: z.array(z.string().trim().min(1).max(50)).max(30).default([]),
  features: textArray,
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  liveDemoUrl: optionalUrl,
  featured: z.boolean().default(true),
  published: z.boolean().default(true),
  order: z.number().int().min(0).max(10000).default(0),
});

function slugFromTitle(title) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return slug || 'project';
}

export const projectBodySchema = projectFieldsSchema
  .refine((value) => Boolean(value.description || value.fullDescription), {
    message: 'A full project description is required.',
    path: ['fullDescription'],
  })
  .transform((value) => {
    const fullDescription = value.fullDescription || value.description;
    const shortDescription = value.shortDescription || value.summary || fullDescription.slice(0, 300);

    return {
      ...value,
      slug: value.slug || slugFromTitle(value.title),
      summary: value.summary || shortDescription,
      shortDescription,
      description: value.description || fullDescription,
      fullDescription,
      liveUrl: value.liveUrl || value.liveDemoUrl,
      liveDemoUrl: value.liveDemoUrl || value.liveUrl,
    };
  });

export const projectUpdateSchema = projectFieldsSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one project field is required.',
  });

export const projectQuerySchema = z.object({
  featured: z.enum(['true', 'false']).optional(),
});
