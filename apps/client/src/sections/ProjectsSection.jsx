import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import ProjectCard from "../components/ProjectCard";
import ProjectDetailsModal from "../components/ProjectDetailsModal";

const categoryOrder = ["Commerce", "Computer Vision"];

function ProjectsSection({ projects }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
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
      className="scroll-mt-28 border-t border-white/10 px-4 pb-14 pt-14 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Selected work"
            title="Projects with a point of view."
            description="A focused collection of systems and interfaces. Repository and deployment links appear only when real URLs are available."
          />
        </Reveal> 
        <motion.div layout className="mt-10 grid items-stretch gap-6 lg:grid-cols-2">
          {visibleProjects.length ? visibleProjects.map((project, index) => (
              <ProjectCard
                key={project._id || project.slug || project.title}
                project={project}
                index={index}
                onOpenDetails={setSelectedProject}
              />
            )) : (
              <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center text-sm text-slate-500 lg:col-span-2">
                No projects are available in this category yet.
              </div>
            )}
        </motion.div>
      </div>
      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}

export default ProjectsSection;
