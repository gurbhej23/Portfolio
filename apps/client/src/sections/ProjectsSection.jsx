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
