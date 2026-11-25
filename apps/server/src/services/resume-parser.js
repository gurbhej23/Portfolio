const SECTION_NAMES = [
  'summary',
  'objective',
  'skills',
  'technical skills',
  'projects',
  'experience',
  'work experience',
  'professional experience',
  'education',
  'certifications',
];

const TECHNOLOGY_NAMES = [
  'Django REST Framework',
  'Tailwind CSS',
  'Prompt Engineering',
  'AI-Assisted Development',
  'JWT Authentication',
  'Python OOPs',
  'JavaScript',
  'TypeScript',
  'JavaScript/TypeScript',
  'React.js',
  'React',
  'Next.js',
  'HTML5',
  'CSS3',
  'Node.js',
  'Express.js',
  'Socket.io',
  'MongoDB',
  'PostgreSQL',
  'NumPy',
  'Pandas',
  'Matplotlib',
  'Django',
  'REST APIs',
  'MERN',
  'SendGrid',
  'GitHub',
  'Git',
  'Vercel',
  'Render',
  'Antigravity Agent',
  'Python',
];

const MONTH = '(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)';
const DATE_PART = '(?:' + MONTH + '\\s+\\d{4}|\\d{4}|Present|Current)';
const DATE_RANGE = new RegExp('(' + DATE_PART + ')\\s*[\\u2013\\u2014-]\\s*(' + DATE_PART + ')', 'i');
const URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/[a-z0-9._~:/?#\[\]@!$&'()*+,;=%-]*)?/gi;

function clamp(value, length) {
  const text = String(value || '').trim();
  if (text.length <= length) return text;
  return text.slice(0, length - 3).trimEnd() + '...';
}

function unique(values) {
  const seen = new Set();
  return values.filter((value) => {
    const key = value.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function cleanLine(value) {
  return String(value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/[\t ]+/g, ' ')
    .trim();
}

function isBulletLine(line) {
  return /^(?:[\u2022\u25cf\u25aa\u25e6\u2023]|l)\s+/i.test(line.trim());
}

function cleanBullet(line) {
  return cleanLine(line).replace(/^(?:[\u2022\u25cf\u25aa\u25e6\u2023]|l)\s+/i, '').trim();
}

function normalizeLines(text) {
  return String(text || '')
    .replace(/\r/g, '')
    .split('\n')
    .map(cleanLine)
    .filter((line) => line && !/^--\s*\d+\s+of\s+\d+\s*--$/i.test(line));
}

function splitSections(text) {
  const sections = { identity: [] };
  let active = 'identity';

  normalizeLines(text).forEach((line) => {
    const heading = SECTION_NAMES.find((name) => line.toLowerCase() === name);
    if (heading) {
      active = heading;
      sections[active] ||= [];
      return;
    }
    sections[active] ||= [];
    sections[active].push(line);
  });

  return sections;
}

function collapse(lines) {
  return clamp(lines.map(cleanLine).filter(Boolean).join(' '), 5000);
}

function looksLikeBlockHeader(line) {
  return Boolean(line.match(DATE_RANGE) || line.match(URL_PATTERN) || line.match(/[\u2014\u2013]\s+/));
}

function collectBlocks(lines) {
  const blocks = [];
  let current = null;

  lines.forEach((line) => {
    if (isBulletLine(line)) {
      current ||= { header: '', bullets: [] };
      current.bullets.push(cleanBullet(line));
      return;
    }

    if (!current) {
      current = { header: line, bullets: [] };
      return;
    }

    if (current.bullets.length && looksLikeBlockHeader(line)) {
      blocks.push(current);
      current = { header: line, bullets: [] };
    } else if (current.bullets.length) {
      current.bullets[current.bullets.length - 1] = (current.bullets[current.bullets.length - 1] + ' ' + line).trim();
    } else {
      current.header = (current.header + ' ' + line).trim();
    }
  });

  if (current && (current.header || current.bullets.length)) blocks.push(current);
  return blocks;
}

function parseDateRange(value) {
  const text = String(value || '');
  const match = text.match(DATE_RANGE);
  if (!match) return { startDate: '', endDate: '', current: false, withoutDates: text.trim() };
  return {
    startDate: match[1].trim(),
    endDate: /^(present|current)$/i.test(match[2]) ? '' : match[2].trim(),
    current: /^(present|current)$/i.test(match[2]),
    withoutDates: (text.slice(0, match.index) + ' ' + text.slice(match.index + match[0].length)).trim(),
  };
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 130) || 'resume-project';
}

function findTechnologies(value, skills) {
  const source = String(value || '');
  const candidates = unique([...(skills || []), ...TECHNOLOGY_NAMES]).sort((a, b) => b.length - a.length);
  const found = [];

  candidates.forEach((candidate) => {
    const escaped = candidate.replace(/[.*+?^\x24()|[\]\\]/g, '\\$&');
    if (new RegExp('(^|[^a-z0-9])' + escaped + '(?=$|[^a-z0-9])', 'i').test(source)) found.push(candidate);
  });

  return unique(found).slice(0, 30);
}

function parseSkills(lines) {
  const skills = [];
  let activeCategory = 'Other';

  lines.forEach((originalLine) => {
    let line = originalLine;
    const match = line.match(/^([^:]{2,60}):\s*(.+)$/);
    if (match) {
      activeCategory = cleanLine(match[1]);
      line = match[2];
    } else if (!line.includes(',')) {
      return;
    }

    const values = line
      .split(/,|;/)
      .flatMap((value) => value.split(/\s*\/\s*/))
      .map((value) => cleanLine(value).replace(/^[-\u2022]+\s*/, ''))
      .filter(Boolean);

    values.forEach((name) => {
      if (!skills.some((skill) => skill.name.toLowerCase() === name.toLowerCase())) {
        skills.push({
          name: clamp(name, 80),
          category: clamp(activeCategory, 40),
          proficiency: null,
          order: skills.length,
          source: 'resume',
        });
      }
    });
  });

  return skills;
}

function parseProjectHeader(header) {
  const urls = header.match(URL_PATTERN) || [];
  const liveUrl = urls.find((url) => !/github\.com/i.test(url)) || '';
  const title = cleanLine(header.replace(URL_PATTERN, '').replace(/[|]+/g, ' '));
  return {
    title: title || 'Resume project',
    liveUrl: liveUrl ? (/^https?:\/\//i.test(liveUrl) ? liveUrl : 'https://' + liveUrl) : '',
  };
}

function parseProjects(lines, skills) {
  return collectBlocks(lines).map((block, index) => {
    const header = parseProjectHeader(block.header);
    const description = collapse(block.bullets);
    return {
      title: clamp(header.title, 120),
      slug: slugify(header.title),
      category: /\bmern\b|\bfull[- ]stack\b/i.test(header.title + ' ' + description) ? 'Full-Stack' : 'Web Development',
      summary: clamp(block.bullets[0] || 'A project documented in the uploaded resume: ' + header.title + '.', 300),
      description: clamp(description || 'A project documented in the uploaded resume: ' + header.title + '.', 5000),
      technologies: findTechnologies(header.title + ' ' + description, skills),
      githubUrl: (block.header.match(/https?:\/\/[^\s]+github\.com[^\s]*/i) || [])[0] || '',
      liveUrl: header.liveUrl,
      featured: index === 0,
      published: true,
      order: index,
      source: 'resume',
    };
  }).filter((project) => project.title);
}

function splitTitleAndCompany(value) {
  const dashed = value.match(/^(.*?)\s+[\u2014\u2013-]\s+(.+)$/);
  if (dashed) return { title: dashed[1].trim(), company: dashed[2].trim() };
  const at = value.match(/^(.*?)\s+at\s+(.+)$/i);
  if (at) return { title: at[1].trim(), company: at[2].trim() };
  return { title: value.trim(), company: '' };
}

function parseExperience(lines, skills) {
  return collectBlocks(lines).map((block, index) => {
    const dates = parseDateRange(block.header);
    const role = splitTitleAndCompany(dates.withoutDates);
    let company = role.company || role.title;
    let title = role.company ? role.title : '';
    const locationMatch = company.match(/\(([^)]+)\)\s*$/);
    const location = locationMatch ? locationMatch[1].trim() : '';
    company = company.replace(/\s*\([^)]*\)\s*$/, '').trim();
    if (!title) title = company;

    const description = collapse(block.bullets);
    return {
      company: clamp(company, 120),
      title: clamp(title, 120),
      employmentType: /intern/i.test(title) ? 'Internship' : /contract/i.test(title) ? 'Contract' : '',
      location: clamp(location, 120),
      startDate: dates.startDate,
      endDate: dates.endDate,
      current: dates.current,
      description: clamp(description, 5000),
      highlights: block.bullets.slice(0, 20).map((item) => clamp(item, 500)),
      technologies: findTechnologies(block.header + ' ' + description, skills),
      order: index,
      source: 'resume',
    };
  }).filter((item) => item.company && item.title);
}

function parseEducation(lines) {
  return lines.map((line, index) => {
    const dates = parseDateRange(line);
    const parts = splitTitleAndCompany(dates.withoutDates);
    return {
      degree: clamp(parts.title, 160),
      institution: clamp(parts.company || parts.title, 160),
      field: '',
      startDate: dates.startDate,
      endDate: dates.endDate || (dates.current ? 'Present' : ''),
      description: '',
      order: index,
      source: 'resume',
    };
  }).filter((item) => item.degree && item.institution);
}

function parseIdentity(lines) {
  const headline = cleanLine(lines[0] || '');
  const identityText = lines.slice(1).join(' ');
  const email = (identityText.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/) || [])[0] || '';
  const location = lines.slice(1)
    .flatMap((line) => line.split('|'))
    .map(cleanLine)
    .find((part) => part && !part.includes('@') && !/^\+?[\d ()-]{7,}$/.test(part) && !/github|linkedin/i.test(part)) || '';
  return { headline, email, location };
}

function buildJourney(experience, projects, education) {
  const parts = [];
  if (experience.length) {
    parts.push('My professional experience includes ' + experience.map((item) => item.title + ' at ' + item.company.replace(/[.!?]+$/, '')).join(', ') + '.');
  }
  if (projects.length) {
    parts.push('I have built ' + projects.map((project) => project.title).join(', ') + ', applying the technologies and practices described in my project work.');
  }
  if (education.length) {
    parts.push('My academic background includes ' + education.map((item) => item.degree + ' at ' + item.institution).join(' and ') + '.');
  }
  return clamp(parts.join(' '), 5000);
}

export function parseResumeText(text) {
  const sections = splitSections(text);
  const identity = parseIdentity(sections.identity || []);
  const summary = collapse(sections.summary || sections.objective || []);
  const skills = parseSkills(sections.skills || sections['technical skills'] || []);
  const projects = parseProjects(sections.projects || [], skills.map((skill) => skill.name));
  const experience = parseExperience(
    sections.experience || sections['work experience'] || sections['professional experience'] || [],
    skills.map((skill) => skill.name),
  );
  const education = parseEducation(sections.education || []);
  const role = (summary.match(/^(.+?)\s+(?:skilled|with|experienced)\b/i) || [])[1]?.replace(/[, ]+$/, '') || '';
  const journey = buildJourney(experience, projects, education);

  return {
    hero: {
      headline: clamp(identity.headline, 160),
      role: clamp(role, 120),
      roles: role ? [clamp(role, 120)] : [],
      introduction: clamp(summary, 1000),
    },
    about: {
      summary: clamp(summary || journey, 3000),
      journey,
    },
    contact: {
      email: clamp(identity.email, 160),
      location: clamp(identity.location, 160),
    },
    skills,
    projects,
    experience,
    education,
  };
}

export { slugify };
