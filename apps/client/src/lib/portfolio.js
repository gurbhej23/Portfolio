const fallbackSkills = [
  { name: 'Python', category: 'Programming' },
  { name: 'JavaScript', category: 'Programming' },
  { name: 'HTML', category: 'Frontend' },
  { name: 'CSS', category: 'Frontend' },
  { name: 'React', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express.js', category: 'Backend' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'Mongoose', category: 'Database' },
  { name: 'SQLite', category: 'Database' },
  { name: 'Django', category: 'Backend' },
  { name: 'REST APIs', category: 'Backend' },
  { name: 'Git', category: 'Tools' },
  { name: 'GitHub', category: 'Tools' },
  { name: 'Postman', category: 'Tools' },
  { name: 'VS Code', category: 'Tools' },
  { name: 'JWT', category: 'Other' },
  { name: 'OpenCV', category: 'Other' },
  { name: 'DeepFace', category: 'Other' },
];

const fallbackProjects = [
  {
    title: 'Necessity India',
    slug: 'necessity-india',
    category: 'Commerce',
    summary: 'B2B wholesale ordering platform with customer approval, product management, pricing and order processing.',
    description: 'A B2B wholesale ordering platform designed around customer approval, product management, pricing, order processing, and Zoho integration.',
    technologies: ['React', 'React Native CLI', 'Node.js', 'Express', 'MongoDB', 'Zoho integration'],
    githubUrl: '',
    liveUrl: '',
    featured: true,
    imageUrl: '',
  },
  {
    title: 'AttendanceFaceAuth',
    slug: 'attendance-face-auth',
    category: 'Computer Vision',
    summary: 'Face recognition attendance and employee management system.',
    description: 'A face recognition attendance and employee management system built across a Python/Django backend and React interface.',
    technologies: ['Python', 'Django', 'React', 'OpenCV', 'DeepFace', 'JWT'],
    githubUrl: '',
    liveUrl: '',
    featured: true,
    imageUrl: '',
  },
];

const defaultIntroduction = 'Full-Stack Developer focused on building thoughtful web experiences across the frontend and backend.';
const defaultAboutSummary = 'I am a Full-Stack Developer interested in building reliable backend systems and clear, responsive frontend experiences.';
const defaultJourney = 'My journey is shaped by curiosity, hands-on learning, and a practical problem-solving approach: understand the problem, break it down, and build with clarity.';

export function resolveMediaUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const rawApi = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
    ? import.meta.env.VITE_API_URL
    : (typeof process !== 'undefined' && process.env && process.env.PUBLIC_API_URL) || 'http://localhost:5000/api';
  const serverOrigin = rawApi.replace(/\/api\/?$/, '').replace(/\/+$/, '');

  if (url.includes('localhost:5000')) {
    return url.replace(/^https?:\/\/localhost:5000/i, serverOrigin);
  }
  if (url.startsWith('/uploads/')) {
    return `${serverOrigin}${url}`;
  }
  return url;
}

export function normalizePortfolio(payload = {}) {
  const content = payload.content || {};
  const hero = content.hero || {};
  const about = content.about || {};
  const contact = content.contact || {};

  return {
    content: {
      ...content,
      hero: {
        ...hero,
        headline: hero.headline || 'Gurbhej Singh',
        role: hero.role || 'Full-Stack Developer',
        roles: hero.roles?.length ? hero.roles : ['Python Developer', 'MERN Stack Developer', hero.role || 'Full-Stack Developer'],
        introduction: hero.introduction || defaultIntroduction,
      },
      about: {
        ...about,
        summary: about.summary || defaultAboutSummary,
        journey: about.journey || defaultJourney,
      },
      contact,
      resumeUrl: resolveMediaUrl(content.resumeUrl || ''),
      profilePhotoUrl: resolveMediaUrl(content.profilePhotoUrl || ''),
      socialLinks: content.socialLinks || [],
    },
    projects: (payload.projects?.length ? payload.projects : fallbackProjects).map((project) => {
      const thumbnail = resolveMediaUrl(project.thumbnail || project.imageUrl || '');
      const images = [...new Set([
        thumbnail,
        ...(Array.isArray(project.images) ? project.images : []),
      ].map(resolveMediaUrl).filter(Boolean))];

      return {
        ...project,
        imageUrl: resolveMediaUrl(project.imageUrl || thumbnail),
        thumbnail,
        images,
        shortDescription: project.shortDescription || project.summary || '',
        fullDescription: project.fullDescription || project.description || '',
        liveDemoUrl: project.liveDemoUrl || project.liveUrl || '',
      };
    }),
    skills: payload.skills?.length ? payload.skills : fallbackSkills,
    experience: payload.experience || [],
    education: payload.education || [],
    certifications: (payload.certifications || []).map((cert) => ({
      ...cert,
      attachmentUrl: resolveMediaUrl(cert.attachmentUrl),
    })),
  };
}

export function isPlaceholder(value) {
  return typeof value === 'string' && value.startsWith('[') && value.endsWith(']');
}

export function getEmailHref(email) {
  const normalizedEmail = String(email || '').trim();
  if (!normalizedEmail) return '';
  if (/@(?:gmail\.com|googlemail\.com)$/i.test(normalizedEmail)) {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(normalizedEmail)}`;
  }
  return `mailto:${normalizedEmail}`;
}
