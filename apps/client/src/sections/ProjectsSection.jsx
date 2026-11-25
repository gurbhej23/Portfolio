import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import ProjectCard from "../components/ProjectCard";

const categoryOrder = ["Commerce", "Computer Vision"];

function ProjectsSection({ projects }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = useMemo(() => {
    const available = new Set(
      projects.map((project) => project.category || "Other"),
    );
    const ordered = categoryOrder.filter((category) => available.has(category));
    const additional = [...available]
      .filter((category) => !categoryOrder.includes(category))
      .sort();
    return [...ordered, ...additional];
  }, [projects]);
  const visibleProjects =
    activeCategory === "All"
      ? projects
      : projects.filter(
          (project) => (project.category || "Other") === activeCategory,
        );

  return (
    <section
      id="projects"
      className="scroll-mt-28 border-t border-white/10 px-6 pb-14 pt-14 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Selected work"
            title="Projects with a point of view."
            description="A focused collection of systems and interfaces. Repository and deployment links appear only when real URLs are available."
          />
        </Reveal>
        <Reveal delay={0.08}>
          <div
            className="mt-10 flex flex-wrap gap-2"
            role="tablist"
            aria-label="Project categories"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === "All"}
              onClick={() => setActiveCategory("All")}
              className={`rounded-full border px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 ${activeCategory === "All" ? "border-cyan-200/50 bg-cyan-200/10 text-cyan-100" : "border-white/10 text-slate-400 hover:border-white/25 hover:text-white"}`}
            >
              All projects
            </button>
            {categories.map((category) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === category}
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70 ${activeCategory === category ? "border-violet-200/50 bg-violet-200/10 text-violet-100" : "border-white/10 text-slate-400 hover:border-white/25 hover:text-white"}`}
              >
                {category}
              </button>
            ))}
          </div>
        </Reveal>
        <motion.div layout className="mt-10 grid gap-6 lg:grid-cols-2">
          {visibleProjects.map((project, index) => (
            <ProjectCard
              key={project._id || project.slug || project.title}
              project={project}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default ProjectsSection;
