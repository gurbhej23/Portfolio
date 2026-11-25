import { z } from 'zod';

const optionalUrl = z.string().trim().url('Must be a valid URL.').or(z.literal('')).default('');
const nonNegativeOrder = z.number().int().min(0).max(10000).default(0);
const optionalUrlOrAnchor = z.string().trim().refine((value) => {
  if (value === '' || /^#[A-Za-z][A-Za-z0-9:_-]*$/.test(value)) return true;
  try {
    return Boolean(new URL(value));
  } catch {
    return false;
  }
}, 'Must be a valid URL or section anchor.').default('');

export const skillBodySchema = z.object({
  name: z.string().trim().min(1).max(80),
  category: z.string().trim().min(1).max(40),
  proficiency: z.number().int().min(0).max(100).nullable().default(null),
  order: nonNegativeOrder,
});

export const experienceBodySchema = z.object({
  company: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(120),
  employmentType: z.string().trim().max(60).default(''),
  location: z.string().trim().max(120).default(''),
  startDate: z.string().trim().max(40).default(''),
  endDate: z.string().trim().max(40).default(''),
  current: z.boolean().default(false),
  description: z.string().trim().max(5000).default(''),
  highlights: z.array(z.string().trim().min(1).max(500)).max(20).default([]),
  technologies: z.array(z.string().trim().min(1).max(50)).max(30).default([]),
  order: nonNegativeOrder,
});

export const educationBodySchema = z.object({
  institution: z.string().trim().min(1).max(160),
  degree: z.string().trim().min(1).max(160),
  field: z.string().trim().max(120).default(''),
  startDate: z.string().trim().max(40).default(''),
  endDate: z.string().trim().max(40).default(''),
  description: z.string().trim().max(3000).default(''),
  order: nonNegativeOrder,
});

export const certificationBodySchema = z.object({
  name: z.string().trim().min(1).max(160),
  issuer: z.string().trim().min(1).max(160),
  issueDate: z.string().trim().max(40).default(''),
  credentialUrl: optionalUrl,
  order: nonNegativeOrder,
});

export const portfolioContentBodySchema = z.object({
  hero: z.object({
    headline: z.string().trim().max(160).default(''),
    role: z.string().trim().max(120).default(''),
    roles: z.array(z.string().trim().min(1).max(120)).max(8).default([]),
    introduction: z.string().trim().max(1000).default(''),
    primaryCtaLabel: z.string().trim().max(80).default(''),
    primaryCtaUrl: optionalUrlOrAnchor,
  }).default({}),
  about: z.object({
    summary: z.string().trim().max(3000).default(''),
    journey: z.string().trim().max(5000).default(''),
  }).default({}),
  contact: z.object({
    email: z.string().trim().email().or(z.literal('')).default(''),
    location: z.string().trim().max(160).default(''),
    availability: z.string().trim().max(500).default(''),
  }).default({}),
  resumeUrl: optionalUrl,
  profilePhotoUrl: optionalUrl,
  socialLinks: z.array(z.object({
    label: z.string().trim().min(1).max(40),
    url: z.string().trim().url().max(500),
    icon: z.string().trim().max(40).default(''),
  })).max(20).default([]),
});

export const messageQuerySchema = z.object({
  status: z.enum(['new', 'read', 'replied', 'archived']).optional(),
});

export const messageStatusSchema = z.object({
  status: z.enum(['new', 'read', 'replied', 'archived']),
});
