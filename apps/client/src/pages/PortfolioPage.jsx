import { AlertTriangle, LoaderCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import PortfolioNav from "../components/PortfolioNav";
import HeroSection from "../sections/HeroSection";
import AboutSection from "../sections/AboutSection";
import SkillsSection from "../sections/SkillsSection";
import ProjectsSection from "../sections/ProjectsSection";
import JourneySection from "../sections/JourneySection";
import ResumeSection from "../sections/ResumeSection";
import ContactSection from "../sections/ContactSection";
import Footer from "../sections/Footer";
import useActiveSection from "../hooks/useActiveSection";

const portfolioSectionIds = [
  "top",
  "skills",
  "projects",
  "journey",
  "about",
  "contact",
];

function PortfolioPage({ data, loading, apiError }) {
  const activeSection = useActiveSection(portfolioSectionIds);

  return (
    <div className="min-h-screen overflow-hidden bg-[#080b13] text-slate-200">
      <PortfolioNav activeSection={activeSection} content={data.content} />
      {apiError && (
        <div className="relative z-40 border-b border-amber-200/20 bg-amber-200/[0.07] px-6 py-3 pt-24 text-center text-xs text-amber-100 sm:pt-3">
          <AlertTriangle size={14} className="mr-2 inline" aria-hidden="true" />
          Live content is unavailable, so editable profile placeholders are
          being shown.
        </div>
      )}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/65 p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex min-w-48 flex-col items-center rounded-3xl border border-white/15 bg-slate-950/80 px-8 py-7 text-center shadow-2xl shadow-black/40"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-200">
                <LoaderCircle size={22} className="animate-spin" aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm font-semibold text-white">Loading portfolio</p>
              <p className="mt-1 text-xs text-slate-400">Preparing the latest content…</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <main>
        <HeroSection content={data.content} />
        <SkillsSection skills={data.skills} />
        <ProjectsSection projects={data.projects} />
        <JourneySection
          experience={data.experience}
          education={data.education}
          certifications={data.certifications}
        />
        <ResumeSection resumeUrl={data.content.resumeUrl} />
        <AboutSection content={data.content} />
        <ContactSection contact={data.content.contact} />
      </main>
      <Footer />
    </div>
  );
}

export default PortfolioPage;
