import test from 'node:test';
import assert from 'node:assert/strict';
import { contactBodySchema } from '../src/validators/contact.validator.js';
import { loginBodySchema } from '../src/validators/auth.validator.js';
import { projectBodySchema, projectQuerySchema } from '../src/validators/project.validator.js';

test('contact validation accepts a complete message and applies defaults', () => {
  const result = contactBodySchema.parse({
    name: '  Ada <Example> ',
    email: 'ada@example.com',
    message: 'I would like to discuss a product build.',
  });

  assert.equal(result.subject, '');
  assert.equal(result.email, 'ada@example.com');
  assert.equal(result.name, 'Ada');
  assert.equal(result.website, '');
});

test('contact validation rejects short messages and invalid email addresses', () => {
  assert.throws(() => contactBodySchema.parse({ name: 'A', email: 'not-an-email', message: 'short' }));
});

test('contact validation rejects a filled honeypot field', () => {
  assert.throws(() => contactBodySchema.parse({ name: 'Ada Example', email: 'ada@example.com', message: 'A valid message here.', website: 'spam' }));
});

test('login validation requires a valid email and password', () => {
  assert.deepEqual(loginBodySchema.parse({ email: 'admin@example.com', password: 'password' }), {
    email: 'admin@example.com',
    password: 'password',
  });
  assert.throws(() => loginBodySchema.parse({ email: 'admin', password: '' }));
});

test('project validation rejects unsafe slugs and accepts empty optional links', () => {
  const project = projectBodySchema.parse({
    title: 'Example project',
    slug: 'example-project',
    summary: 'A short summary',
    description: 'A longer description for the example project.',
  });

  assert.equal(project.githubUrl, '');
  assert.equal(project.category, 'Other');
  assert.throws(() => projectBodySchema.parse({ ...project, slug: 'Unsafe Slug' }));
});

test('project validation derives internal fields for the simplified admin form', () => {
  const project = projectBodySchema.parse({
    title: 'My New Project',
    description: 'A verified project description.',
  });

  assert.equal(project.slug, 'my-new-project');
  assert.equal(project.summary, 'A verified project description.');
  assert.equal(project.published, true);
  assert.equal(project.featured, true);
});

test('project query validation only accepts supported filters', () => {
  assert.deepEqual(projectQuerySchema.parse({ featured: 'true' }), { featured: 'true' });
  assert.throws(() => projectQuerySchema.parse({ featured: 'yes' }));
});
