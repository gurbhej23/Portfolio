import test from 'node:test';
import assert from 'node:assert/strict';
import { parseResumeText } from '../src/services/resume-parser.js';

test('resume parser maps labeled resume sections to portfolio records', () => {
  const parsed = parseResumeText([
    'Gurbhej Singh',
    '97802-37176 | gurbhejs728@gmail.com | Ludhiana',
    'SUMMARY',
    'Full Stack Developer skilled in Python, React.js, and MongoDB.',
    'SKILLS',
    'Languages: Python, JavaScript/TypeScript',
    'Frontend: React.js, Tailwind CSS',
    'PROJECTS',
    'Attendance App attendanceauth.vercel.app',
    'l Built a full-stack attendance system using React and Django.',
    'l Added secure authentication.',
    'EXPERIENCE',
    'Software Developer Intern — Iotasol Pvt. Ltd. (Ludhiana) Feb 2026 - Aug 2026',
    'l Built production features with Python and Django.',
    'EDUCATION',
    'Master of Computer Application (MCA) — IKG Punjab Technical University 2022 - 2024',
  ].join('\n'));

  assert.equal(parsed.hero.headline, 'Gurbhej Singh');
  assert.equal(parsed.hero.role, 'Full Stack Developer');
  assert.equal(parsed.about.summary.includes('MongoDB'), true);
  assert.equal(parsed.skills.some((skill) => skill.name === 'TypeScript'), true);
  assert.equal(parsed.projects.length, 1);
  assert.equal(parsed.projects[0].liveUrl, 'https://attendanceauth.vercel.app');
  assert.equal(parsed.experience.length, 1);
  assert.equal(parsed.experience[0].company, 'Iotasol Pvt. Ltd.');
  assert.equal(parsed.education[0].institution, 'IKG Punjab Technical University');
});
