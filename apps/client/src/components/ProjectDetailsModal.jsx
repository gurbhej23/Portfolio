import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Image as ImageIcon,
  Maximize2,
  X,
} from "lucide-react";

function asList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return value ? [value] : [];
}

function hasContent(value) {
  return Array.isArray(value) ? value.some(Boolean) : Boolean(value);
}

function DetailSection({ title, children, show = true }) {
  if (!show) return null;

  return (
    <section className="border-t border-white/10 pt-5 first:border-t-0 first:pt-0">
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
        {title}
      </h3>
      <div className="mt-3 text-sm leading-7 text-slate-300">{children}</div>
    </section>
  );
}

function DetailContent({ value }) {
  const items = asList(value);
  if (!items.length) return null;

  if (items.length === 1 && !Array.isArray(value)) {
    return <p>{items[0]}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex gap-3">
          <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ProjectDetailsModal({ project, onClose }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [expandedImage, setExpandedImage] = useState(false);

  const images = useMemo(
    () =>
      [...new Set([
        project?.thumbnail,
        project?.imageUrl,
        ...(Array.isArray(project?.images) ? project.images : []),
      ].filter(Boolean))],
    [project],
  );

  useEffect(() => {
    setActiveImageIndex(0);
    setExpandedImage(false);
  }, [project?._id, project?.slug]);

  useEffect(() => {
    if (activeImageIndex >= images.length) setActiveImageIndex(0);
  }, [activeImageIndex, images.length]);

  useEffect(() => {
    if (!project) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        if (expandedImage) setExpandedImage(false);
        else onClose();
      }
      if (images.length > 1 && event.key === "ArrowLeft") {
        setActiveImageIndex((current) => (current - 1 + images.length) % images.length);
      }
      if (images.length > 1 && event.key === "ArrowRight") {
        setActiveImageIndex((current) => (current + 1) % images.length);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [expandedImage, images.length, onClose, project]);

  const activeImage = images[activeImageIndex];
  const solutions = project?.solutions || project?.solution;
  const fullDescription = project?.fullDescription || project?.description;
  const githubUrl = project?.githubUrl;
  const liveDemoUrl = project?.liveDemoUrl || project?.liveUrl;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key={project._id || project.slug || project.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="modal-scrollbar fixed inset-0 z-[60] overflow-y-auto bg-slate-950/80 p-3 backdrop-blur-md sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto grid min-h-0 max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#111521] shadow-2xl shadow-black/50 lg:grid-cols-[1.08fr_0.92fr]"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-slate-950/70 text-slate-300 backdrop-blur transition hover:border-cyan-200/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 sm:right-5 sm:top-5 cursor-pointer"
            >
              <X size={18} aria-hidden="true" />
            </button>

            <div className="min-w-0 border-b border-white/10 p-4 sm:p-6 lg:border-b-0 lg:border-r lg:p-8">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50">
                {activeImage ? (
                  <button
                    type="button"
                    onClick={() => setExpandedImage(true)}
                    aria-label="Enlarge project screenshot"
                    className="group relative block aspect-[16/10] w-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 cursor-pointer"
                  >
                    <motion.img
                      key={activeImage}
                      src={activeImage}
                      alt={`${project.title} screenshot ${activeImageIndex + 1}`}
                      initial={{ opacity: 0.25 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                    <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/70 px-3 py-2 text-xs font-semibold text-white opacity-90 backdrop-blur">
                      <Maximize2 size={13} aria-hidden="true" />
                      Enlarge
                    </span>
                  </button>
                ) : (
                  <div className="flex aspect-[16/10] flex-col items-center justify-center gap-3 text-center text-slate-500">
                    <ImageIcon size={26} aria-hidden="true" />
                    <p className="text-sm">No screenshots available for this project.</p>
                  </div>
                )}
              </div>

              {images.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                    <span>Screenshot {activeImageIndex + 1} / {images.length}</span>
                    {images.length > 1 && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveImageIndex((current) => (current - 1 + images.length) % images.length)}
                          aria-label="Previous screenshot"
                          className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-slate-300 transition hover:border-cyan-300/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                        >
                          <ChevronLeft size={16} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveImageIndex((current) => (current + 1) % images.length)}
                          aria-label="Next screenshot"
                          className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-slate-300 transition hover:border-cyan-300/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                        >
                          <ChevronRight size={16} aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>
                  {images.length > 1 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                      {images.map((image, index) => (
                        <button
                          type="button"
                          key={`${image}-${index}`}
                          onClick={() => setActiveImageIndex(index)}
                          aria-label={`Show screenshot ${index + 1}`}
                          aria-current={index === activeImageIndex}
                          className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 ${index === activeImageIndex ? "border-cyan-200" : "border-white/10 opacity-65 hover:opacity-100"}`}
                        >
                          <img src={image} alt="" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {(project.technologies?.length || liveDemoUrl) && (
                <div className="mt-6 border-t border-white/10 pt-5">
                  {project.technologies?.length ? (
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                        Technologies and tools
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.technologies.map((technology) => (
                          <span
                            key={technology}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {liveDemoUrl && (
                    <a
                      href={liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-cyan-200 px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                    >
                      Live demo
                      <ExternalLink size={15} aria-hidden="true" />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="modal-scrollbar min-w-0 max-h-[75vh] overflow-y-auto p-5 sm:p-7 lg:max-h-[calc(100vh-3rem)] lg:p-8">
              <p className="pr-12 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
                {project.category || "Project"}
              </p>
              <h2 id="project-modal-title" className="mt-3 pr-8 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {project.title}
              </h2>
              {project.shortDescription && (
                <p className="mt-4 text-base leading-7 text-slate-300">{project.shortDescription}</p>
              )}

              <div className="mt-7 space-y-6">
                <DetailSection title="Full description" show={hasContent(fullDescription)}>
                  <DetailContent value={fullDescription} />
                </DetailSection>
                <DetailSection title="Project overview" show={hasContent(project.overview)}>
                  <DetailContent value={project.overview} />
                </DetailSection>
                <DetailSection title="Problem" show={hasContent(project.problem)}>
                  <DetailContent value={project.problem} />
                </DetailSection>
                <DetailSection title="Solution" show={hasContent(solutions)}>
                  <DetailContent value={solutions} />
                </DetailSection>
                <DetailSection title="Key features" show={hasContent(project.features)}>
                  <DetailContent value={project.features} />
                </DetailSection>
                <DetailSection title="My role and contributions" show={hasContent(project.role) || hasContent(project.contributions)}>
                  <div className="space-y-3">
                    <DetailContent value={project.role} />
                    <DetailContent value={project.contributions} />
                  </div>
                </DetailSection>
                <DetailSection title="Challenges" show={hasContent(project.challenges)}>
                  <DetailContent value={project.challenges} />
                </DetailSection>
                <DetailSection title="Learnings" show={hasContent(project.learnings)}>
                  <DetailContent value={project.learnings} />
                </DetailSection>
              </div>

              {githubUrl && (
                <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-200/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                  >
                    <Github size={15} aria-hidden="true" />
                    GitHub repository
                  </a>
                </div>
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {expandedImage && activeImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/90 p-4 backdrop-blur-sm sm:p-8"
                onClick={(event) => {
                  if (event.target === event.currentTarget) setExpandedImage(false);
                }}
              >
                <button
                  type="button"
                  onClick={() => setExpandedImage(false)}
                  aria-label="Close enlarged screenshot"
                  className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-slate-950/70 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                >
                  <X size={18} aria-hidden="true" />
                </button>
                <motion.img
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  src={activeImage}
                  alt={`${project.title} enlarged screenshot ${activeImageIndex + 1}`}
                  className="max-h-[90vh] max-w-full rounded-2xl object-contain shadow-2xl"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ProjectDetailsModal;
