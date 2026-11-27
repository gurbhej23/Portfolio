import { motion } from "framer-motion";
import {
  Code2,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";

function ProjectLink({ href, label, icon: Icon }) {
  if (!href) return null;
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

function ProjectCard({ project, index, onOpenDetails }) {
  function handleCardClick(event) {
    if (event.target.closest("a, button")) return;
    onOpenDetails?.(project);
  }

  function handleCardKeyDown(event) {
    if (event.target.closest("a, button")) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onOpenDetails?.(project);
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      whileHover={{ y: -6, scale: 1.015 }}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${project.title}`}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-xl shadow-black/10 transition-[border-color,background-color,box-shadow] hover:border-violet-300/40 hover:bg-white/[0.055] hover:shadow-[0_20px_60px_rgba(76,29,149,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 rounded-[2rem] bg-gradient-to-br from-violet-300/35 via-cyan-200/10 to-cyan-300/35 p-px opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="h-full w-full rounded-[calc(2rem-1px)] bg-[#111521]/95" />
      </div>
      <div className="relative z-10 flex h-56 items-end overflow-hidden bg-gradient-to-br from-violet-950 via-slate-900 to-cyan-950 p-5 sm:h-64 sm:p-7">
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
              No screenshot available
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
        <div className="relative z-10 flex w-full min-w-0 items-end justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              {project.category || "Featured project"}
            </p>
            <h3 className="mt-2 break-words text-xl font-semibold text-white sm:text-2xl">
              {project.title}
            </h3>
          </div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 bg-slate-950/30 text-white backdrop-blur-sm">
            <Code2 size={18} aria-hidden="true" />
          </span>
        </div>
      </div>
      <div className="relative z-10 flex flex-1 flex-col p-4 sm:p-5">
        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 ">
          <div className="flex items-center gap-5">
            <ProjectLink
              href={project.liveDemoUrl || project.liveUrl}
              label="Live demo"
              icon={ExternalLink}
            />
          </div>
          <button
            type="button"
            onClick={() => onOpenDetails?.(project)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-violet-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70 cursor-pointer"
          >
            View details
            <ExternalLink size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default ProjectCard;
