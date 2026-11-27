import { AlertTriangle } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
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

function PortfolioPreloader() {
  const reducedMotion = useReducedMotion();
  const logoReveal = reducedMotion
    ? false
    : { opacity: 0, scale: 0.72, rotate: -8 };
  const logoAnimate = reducedMotion
    ? undefined
    : { opacity: 1, scale: 1, rotate: 0 };

  return (
    <motion.main
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02, filter: "blur(8px)" }}
      transition={{ duration: reducedMotion ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-live="polite"
      className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#080b13] px-6 py-12 text-center"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <motion.div
          animate={reducedMotion ? undefined : { x: [0, 35, 0], y: [0, -22, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-40 top-1/4 h-[24rem] w-[24rem] rounded-full bg-violet-600/20 blur-3xl"
        />
        <motion.div
          animate={reducedMotion ? undefined : { x: [0, -30, 0], y: [0, 24, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -right-40 bottom-1/4 h-[26rem] w-[26rem] rounded-full bg-cyan-400/15 blur-3xl"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,.1),rgba(8,11,19,.82)_72%)]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          initial={logoReveal}
          animate={logoAnimate}
          transition={reducedMotion ? undefined : { type: "spring", stiffness: 170, damping: 16, mass: 0.8 }}
          className="relative mx-auto grid h-32 w-32 place-items-center sm:h-36 sm:w-36"
        >
          <span aria-hidden="true" className="preloader-logo-orbit absolute inset-0 rounded-[2.25rem]" />
          <span aria-hidden="true" className="preloader-logo-breathe absolute inset-3 z-10 rounded-[1.75rem] border border-cyan-200/25 bg-gradient-to-br from-violet-400/15 to-cyan-300/10" />
          <span className="relative z-20 inline-block whitespace-nowrap bg-gradient-to-br from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-5xl font-semibold leading-none tracking-[-0.08em] text-transparent sm:text-6xl">
            GS
          </span>
        </motion.div>

        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 12, letterSpacing: "0.45em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.2em" }}
          transition={{ delay: reducedMotion ? 0 : 0.28, duration: 0.65 }}
          className="mt-9 whitespace-pre-wrap text-[0.68rem] font-medium uppercase text-slate-300 sm:text-sm"
        >
          {"GURBHEJ SINGH"}
        </motion.p>

        <div aria-hidden="true" className="preloader-progress-track mx-auto mt-10 h-px w-full max-w-md overflow-hidden bg-white/10">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.35 }}
            className="preloader-progress-sheen h-full w-2/5 bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-200 shadow-[0_0_18px_rgba(103,232,249,0.8)]"
          />
        </div>
        <p className="mt-4 text-[0.65rem] uppercase tracking-[0.28em] text-slate-500">
          Loading content
        </p>
      </div>
    </motion.main>
  );
}

function PortfolioPage({ data, loading, apiError }) {
  const activeSection = useActiveSection(portfolioSectionIds);
  const [minimumInitialLoader, setMinimumInitialLoader] = useState(true);

  useEffect(() => {
    if (!minimumInitialLoader) return undefined;
    const timeoutId = window.setTimeout(() => setMinimumInitialLoader(false), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [minimumInitialLoader]);

  const pageLoading = loading || minimumInitialLoader;

  return (
    <div className="min-h-screen overflow-hidden bg-[#080b13] text-slate-200">
      <AnimatePresence mode="wait" initial={false}>
        {pageLoading ? (
          <PortfolioPreloader key="portfolio-preloader" />
        ) : (
          <motion.div
            key="portfolio-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45 }}
          >
          <PortfolioNav activeSection={activeSection} content={data.content} />
          {apiError && (
            <div className="relative z-40 border-b border-amber-200/20 bg-amber-200/[0.07] px-6 py-3 pt-24 text-center text-xs text-amber-100 sm:pt-3">
              <AlertTriangle size={14} className="mr-2 inline" aria-hidden="true" />
              Live content is unavailable, so editable profile placeholders are
              being shown.
            </div>
          )}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PortfolioPage;
