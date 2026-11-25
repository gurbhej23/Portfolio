import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Code2,
  ExternalLink,
  Github,
  Image as ImageIcon,
} from "lucide-react";

function ProjectLink({ href, label, icon: Icon }) {
  if (!href)
    return (
      <span
        className="inline-flex cursor-not-allowed items-center gap-2 text-xs font-semibold text-slate-600"
        title={`${label} link to be added`}
      >
        {label} pending
      </span>
    );
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-300 transition hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
    >
      {label}
      <Icon size={14} aria-hidden="true" />
    </a>
  );
}

function ProjectCard({ project, index }) {
  const [expanded, setExpanded] = useState(false);
  const details =
    project.details ||
    project.description ||
    "Project details will be added here.";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-xl shadow-black/10 transition-colors hover:border-violet-300/30 hover:bg-white/[0.055]"
    >
      <div className="relative flex h-64 items-end overflow-hidden bg-gradient-to-br from-violet-950 via-slate-900 to-cyan-950 p-7">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={`${project.title} project screenshot`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-90"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_20%_20%,rgba(167,139,250,.4),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(103,232,249,.28),transparent_34%)] text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/20 bg-slate-950/30 text-cyan-100 backdrop-blur">
              <ImageIcon size={22} aria-hidden="true" />
            </span>
            <span className="text-xs uppercase tracking-[0.18em] text-slate-300">
              Project screenshot placeholder
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
        <div className="relative z-10 flex w-full items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              {project.category || "Featured project"}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              {project.title}
            </h3>
          </div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 bg-slate-950/30 text-white backdrop-blur-sm">
            <Code2 size={18} aria-hidden="true" />
          </span>
        </div>
      </div>
      <div className="p-5"> 
        <div className="flex flex-wrap gap-2">
          {project.technologies?.length ? (
            project.technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300"
              >
                {technology}
              </span>
            ))
          ) : (
            <span className="rounded-full border border-dashed border-amber-200/30 px-3 py-1.5 text-xs text-amber-200/80">
              Tech stack to be added
            </span>
          )}
        </div>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
          <div className="flex items-center gap-5">
            <ProjectLink
              href={project.githubUrl}
              label="GitHub"
              icon={Github}
            />
            <ProjectLink
              href={project.liveUrl}
              label="Live demo"
              icon={ExternalLink}
            />
          </div>
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={`project-details-${project.slug || index}`}
            onClick={() => setExpanded((value) => !value)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-violet-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70"
          >
            {expanded ? "Hide details" : "View details"}
            {expanded ? (
              <ChevronUp size={14} aria-hidden="true" />
            ) : (
              <ChevronDown size={14} aria-hidden="true" />
            )}
          </button>
        </div>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              id={`project-details-${project.slug || index}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28 }}
              className="overflow-hidden"
            >
              <div className="mt-5 rounded-2xl border border-violet-200/15 bg-violet-200/[0.04] p-4">
                <p className="text-sm leading-7 text-slate-300">{details}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

export default ProjectCard;
