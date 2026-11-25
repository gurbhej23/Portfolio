import { AlertTriangle, LoaderCircle } from "lucide-react";
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
      {loading && (
        <div className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-4 py-2 text-xs text-slate-300 shadow-xl backdrop-blur">
          <LoaderCircle
            size={14}
            className="animate-spin text-cyan-300"
            aria-hidden="true"
          />
          Loading content
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
    </div>
  );
}

export default PortfolioPage;
