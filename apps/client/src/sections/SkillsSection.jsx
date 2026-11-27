import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  BrainCircuit,
  Braces,
  Database,
  GitBranch,
  Layers3,
  Monitor,
  ServerCog,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";

function getSkillCategory(skill) {
  return String(skill?.category || "Other").trim() || "Other";
}

const categoryMeta = {
  Frontend: {
    icon: Monitor,
    accent: "text-cyan-200",
    badge: "bg-cyan-500/15",
    description: "Interfaces that feel clear and responsive.",
  },
  Backend: {
    icon: ServerCog,
    accent: "text-fuchsia-200",
    badge: "bg-fuchsia-500/15",
    description: "Services, APIs, and application structure.",
  },
  Database: {
    icon: Database,
    accent: "text-emerald-200",
    badge: "bg-emerald-500/15",
    description: "Data storage and application persistence.",
  },
  "Python Libraries": {
    icon: Braces,
    accent: "text-violet-200",
    badge: "bg-violet-500/15",
    description: "Python tools and libraries for building solutions.",
  },
  Tools: {
    icon: Wrench,
    accent: "text-amber-200",
    badge: "bg-amber-500/15",
    description: "Tools for shipping, testing, and collaboration.",
  },
  Others: {
    icon: BrainCircuit,
    accent: "text-rose-200",
    badge: "bg-rose-500/15",
    description: "Supporting technologies and focused interests.",
  },
  Other: {
    icon: BrainCircuit,
    accent: "text-rose-200",
    badge: "bg-rose-500/15",
    description: "Supporting technologies and focused interests.",
  },
};

const skillIcons = {
  Python: Braces,
  JavaScript: Braces,
  HTML: Layers3,
  CSS: Layers3,
  React: Layers3,
  "Tailwind CSS": Monitor,
  "Node.js": ServerCog,
  "Express.js": ServerCog,
  MongoDB: Database,
  Mongoose: Database,
  SQLite: Database,
  Django: ServerCog,
  "REST APIs": GitBranch,
  Git: GitBranch,
  GitHub: GitBranch,
  Postman: Wrench,
  "VS Code": Wrench,
  JWT: ShieldCheck,
  OpenCV: BrainCircuit,
  DeepFace: BrainCircuit,
};

const skillDescriptions = {
  "Django REST Framework": "A toolkit for building web APIs with Django.",
  "Prompt Engineering": "The practice of designing prompts for useful and reliable AI responses.",
  "AI-Assisted Development": "Using AI tools to support coding, debugging, and software development.",
  "JWT Authentication": "Token-based authentication for securely protecting application routes and APIs.",
  "Python OOPs": "Object-oriented programming in Python for organizing reusable application code.",
  Python: "A versatile programming language for web development, automation, data, and AI.",
  JavaScript: "A programming language for interactive web applications and full-stack development.",
  TypeScript: "A typed superset of JavaScript for building reliable applications.",
  "JavaScript/TypeScript": "Languages for building typed, scalable, and interactive web applications.",
  "React.js": "A JavaScript library for building reusable user interfaces.",
  HTML: "A markup language for structuring web page content.",
  HTML5: "The modern HTML standard for structuring web content and browser features.",
  CSS: "A stylesheet language for designing responsive web interfaces.",
  CSS3: "The modern CSS standard for styling responsive web interfaces.",
  React: "A JavaScript library for building reusable user interfaces.",
  "Tailwind CSS": "A utility-first CSS framework for styling responsive interfaces.",
  "Node.js": "A JavaScript runtime for server-side development.",
  "Express.js": "A Node.js framework for building web servers and REST APIs.",
  "Socket.io": "A library for real-time, bidirectional communication between applications.",
  MongoDB: "A NoSQL database for storing flexible, document-based data.",
  Mongoose: "An ODM library for modeling and accessing MongoDB data.",
  SQLite: "A lightweight relational database stored in a local file.",
  PostgreSQL: "An open-source relational database for structured application data.",
  NumPy: "A Python library for numerical computing with multidimensional arrays.",
  Pandas: "A Python library for data cleaning, analysis, and tabular manipulation.",
  Matplotlib: "A Python library for creating charts and data visualizations.",
  Django: "A Python framework for building secure web applications.",
  "Next.js": "A React framework for building full-stack and server-rendered web applications.",
  "REST APIs": "A standard way for applications to communicate through HTTP endpoints.",
  MERN: "A JavaScript stack combining MongoDB, Express, React, and Node.js.",
  SendGrid: "An email delivery service for sending transactional messages.",
  Git: "A version control system for tracking code changes.",
  GitHub: "A platform for hosting repositories and collaborating on code.",
  Vercel: "A cloud platform for deploying and scaling frontend applications.",
  Render: "A cloud platform for hosting web services and applications.",
  "Antigravity Agent": "An AI development agent for assisted coding workflows.",
  Postman: "A tool for testing and debugging APIs.",
  "VS Code": "A code editor for writing, debugging, and managing projects.",
  JWT: "A token format for securely authenticating API requests.",
  OpenCV: "A computer vision library for image processing and analysis.",
  DeepFace: "A Python framework for face recognition and facial analysis.",
};

function SkillsSection({ skills }) {
  const [activeCategory, setActiveCategory] = useState("");
  const categories = useMemo(() => {
    const seen = new Set();
    return skills
      .map(getSkillCategory)
      .filter((category) => {
        if (seen.has(category)) return false;
        seen.add(category);
        return true;
      });
  }, [skills]);
  const selectedCategory = categories.includes(activeCategory)
    ? activeCategory
    : categories[0];
  const filteredSkills =
    skills.filter((skill) => getSkillCategory(skill) === selectedCategory);

  return (
    <section
      id="skills"
      className="scroll-mt-28 border-t border-white/10 px-4 pb-14 pt-14 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Toolkit"
            title="A practical stack for building end to end."
            description="Explore the technologies currently associated with this portfolio. Skill records are API-driven and can be managed through the admin workspace."
          />
        </Reveal>

        <Reveal delay={0.08}>
          <div
            role="tablist"
            aria-label="Technical skill categories"
            className="mt-8 flex flex-wrap gap-2 text-sm font-medium"
          >
            {categories.map((category) => (
              <button
                type="button"
                role="tab"
                aria-selected={selectedCategory === category}
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`inline-flex max-w-full cursor-pointer items-center rounded-full border px-4 py-2 text-sm capitalize transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 ${selectedCategory === category ? "border-violet-200/50 bg-violet-200/10 text-violet-100" : "border-white/10 text-slate-400 hover:border-white/25 hover:text-white"}`}
              >
                {category}
              </button>
            ))}
          </div>
        </Reveal>

        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            id="skills-grid"
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredSkills.map((skill, index) => {
              const category = getSkillCategory(skill);
              const meta = categoryMeta[category] || categoryMeta.Others;
              const CategoryIcon = meta.icon;
              const SkillIcon = skillIcons[skill.name] || CategoryIcon;
              const skillDescription =
                skillDescriptions[skill.name] || skill.description || meta.description;
              return (
                <motion.article
                  layout
                  key={`${category}-${skill.name}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.28, delay: index * 0.025 }}
                  whileHover={{ y: -6 }}
                  className="group relative min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition-colors hover:border-violet-300/30 hover:bg-white/[0.06] focus-within:border-cyan-300/40 sm:p-5"
                >
                  <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-violet-400/10 blur-2xl transition duration-500 group-hover:bg-cyan-300/15" />
                  <div className="relative flex items-start justify-between gap-4">
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-xl ${meta.badge} ${meta.accent}`}
                    >
                      <SkillIcon size={19} aria-hidden="true" />
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600 transition group-hover:text-slate-400">
                      {category}
                      <ArrowUpRight size={12} aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="relative mt-6 text-lg font-semibold text-white">
                    {skill.name}
                  </h3>
                  <p className="relative mt-2 text-sm leading-6 text-slate-500">
                    {skillDescription}
                  </p>
                </motion.article>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default SkillsSection;
