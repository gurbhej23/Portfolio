import test from 'node:test';
import assert from 'node:assert/strict';
import { isPlaceholder, normalizePortfolio } from '../../client/src/lib/portfolio.js';

test('portfolio normalization preserves known identity defaults without inventing missing biography', () => {
  const portfolio = normalizePortfolio();

  assert.equal(portfolio.content.hero.headline, 'Gurbhej Singh');
  assert.equal(portfolio.content.hero.role, 'Full-Stack Developer');
  assert.equal(portfolio.content.hero.roles.includes('Python Developer'), true);
  assert.equal(isPlaceholder(portfolio.content.about.summary), false);
  assert.equal(portfolio.projects.length, 2);
  assert.equal(portfolio.skills.some((skill) => skill.name === 'React'), true);
});

test('portfolio normalization prefers database content when available', () => {
  const portfolio = normalizePortfolio({
    content: {
      hero: { headline: 'Verified Name', role: 'Verified Role', introduction: 'Verified introduction.' },
      about: { summary: 'Verified summary.', journey: 'Verified journey.' },
      contact: { email: 'verified@example.com' },
      socialLinks: [{ label: 'GitHub', url: 'https://github.com/example', icon: 'Github' }],
    },
    projects: [{ title: 'Verified project', slug: 'verified-project' }],
    skills: [{ name: 'Verified skill', category: 'Tools', proficiency: 80 }],
  });

  assert.equal(portfolio.content.hero.headline, 'Verified Name');
  assert.equal(portfolio.projects[0].title, 'Verified project');
  assert.equal(portfolio.skills[0].proficiency, 80);
  assert.equal(portfolio.content.socialLinks[0].url, 'https://github.com/example');
});
