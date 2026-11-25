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

const projectFieldsSchema = z.object({
  title: z.string().trim().min(1).max(120),
  slug: optionalSlug,
  category: z.string().trim().min(1).max(40).default('Other'),
  summary: optionalSummary,
  description: z.string().trim().min(1).max(5000),
  imageUrl: optionalUrl,
  technologies: z.array(z.string().trim().min(1).max(50)).max(30).default([]),
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  featured: z.boolean().default(true),
  published: z.boolean().default(true),
  order: z.number().int().min(0).max(10000).default(0),
});

function slugFromTitle(title) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return slug || 'project';
}

export const projectBodySchema = projectFieldsSchema.transform((value) => ({
  ...value,
  slug: value.slug || slugFromTitle(value.title),
  summary: value.summary || value.description.slice(0, 300),
}));

export const projectUpdateSchema = projectFieldsSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: 'At least one project field is required.',
});

export const projectQuerySchema = z.object({
  featured: z.enum(['true', 'false']).optional(),
});
