import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { getEmailHref, isPlaceholder } from "../lib/portfolio";

const iconMap = { Github, LinkedIn: Linkedin, Linkedin, Mail };

function HeroSection({ content }) {
  const { hero, socialLinks, contact } = content;
  const reducedMotion = useReducedMotion();
  const roles = hero.roles?.length ? hero.roles : [hero.role];
  const [roleIndex, setRoleIndex] = useState(0);
  const [introductionExpanded, setIntroductionExpanded] = useState(false);
  const roleLinks = [
    {
      label: "GitHub",
      url: socialLinks.find(
        (link) => /github/i.test(link.label || "") || link.icon === "Github",
      )?.url,
      icon: Github,
    },
    {
      label: "LinkedIn",
      url: socialLinks.find(
        (link) =>
          /linkedin/i.test(link.label || "") ||
          ["LinkedIn", "Linkedin"].includes(link.icon),
      )?.url,
      icon: Linkedin,
    },
    {
      label: "Email",
      url: getEmailHref(contact.email),
      icon: Mail,
    },
  ];

  useEffect(() => {
    if (reducedMotion || roles.length < 2) return undefined;
    const interval = window.setInterval(
      () => setRoleIndex((current) => (current + 1) % roles.length),
      3200,
    );
    return () => window.clearInterval(interval);
  }, [reducedMotion, roles.length]);

  useEffect(() => {
    setIntroductionExpanded(false);
  }, [hero.introduction]);

  const currentRole = roles[roleIndex] || hero.role;
  const introduction = hero.introduction || "";
  const introductionLimit = 280;
  const introductionHasMore = introduction.length > introductionLimit;
  const visibleIntroduction = introductionHasMore && !introductionExpanded
    ? `${introduction.slice(0, introductionLimit).trimEnd()}…`
    : introduction;
  const primaryCtaLabel = hero.primaryCtaLabel || "View Projects";
  const primaryCtaUrl = hero.primaryCtaUrl || "#projects";
  const primaryCtaIsExternal = /^https?:\/\//i.test(primaryCtaUrl);
  const resumeUrl = content.resumeUrl || "";
  const resumeDownloadUrl = resumeUrl
    ? `${resumeUrl}${resumeUrl.includes("?") ? "&" : "?"}download=1`
    : "#resume";

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden px-6 pb-5 pt-26 sm:px-10 lg:px-16"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
      <motion.div
        className="pointer-events-none absolute -left-40 top-24 h-[30rem] w-[30rem] rounded-full bg-violet-600/20 blur-3xl"
        animate={
          reducedMotion
            ? undefined
            : { x: [0, 45, 0], y: [0, -30, 0], scale: [1, 1.08, 1] }
        }
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-40 bottom-0 h-[34rem] w-[34rem] rounded-full bg-cyan-400/10 blur-3xl"
        animate={
          reducedMotion
            ? undefined
            : { x: [0, -35, 0], y: [0, 25, 0], scale: [1, 1.12, 1] }
        }
        transition={{
          duration: 19,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-3/4 -translate-x-1/2 to-transparent" />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-16 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[0.875rem] font-semibold uppercase tracking-[0.32em] text-cyan-300"
          >
            Hello, I&apos;m
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-7xl lg:text-8xl"
          >
            {hero.headline}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-5 flex min-h-12 flex-wrap items-center gap-3 text-2xl font-medium text-slate-300 sm:min-h-16 sm:text-4xl"
          >
             
            {reducedMotion ? (
              <span
                className={
                  isPlaceholder(currentRole)
                    ? "text-amber-200/80"
                    : "bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent"
                }
              >
                {currentRole}
              </span>
            ) : (
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentRole}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.35 }}
                  aria-live="polite"
                  className={
                    isPlaceholder(currentRole)
                      ? "text-amber-200/80"
                      : "bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent"
                  }
                >
                  {currentRole}
                </motion.span>
              </AnimatePresence>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="mt-8 max-w-2xl"
          >
            <motion.div id="hero-introduction" layout transition={{ layout: { duration: 0.35, ease: "easeInOut" } }}>
              <AnimatePresence initial={false} mode="wait">
                <motion.p
                  key={introductionExpanded ? "expanded" : "collapsed"}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`text-lg leading-8 ${isPlaceholder(introduction) ? "text-amber-200/80" : "text-slate-300"}`}
                >
                  {visibleIntroduction}
                  {introductionHasMore && (
                    <>
                      {" "}
                      <button
                        type="button"
                        onClick={() => setIntroductionExpanded((expanded) => !expanded)}
                        aria-expanded={introductionExpanded}
                        aria-controls="hero-introduction"
                        className="cursor-pointer font-semibold text-cyan-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-300/70 text-[1rem]"
                      >
                        {introductionExpanded ? "Read less" : "Read more"}
                      </button>
                    </>
                  )}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href={primaryCtaUrl}
              target={primaryCtaIsExternal ? "_blank" : undefined}
              rel={primaryCtaIsExternal ? "noreferrer" : undefined}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80"
            >
              {primaryCtaLabel}
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
            <a
              href={resumeDownloadUrl}
              download={resumeUrl ? "gurbhej-singh-resume.pdf" : undefined}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-violet-300/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/80"
            >
              Download Resume
              <ArrowDown size={16} aria-hidden="true" />
            </a>
          </motion.div>
          <div
            className="mt-10 flex flex-wrap items-center gap-3"
            aria-label="Professional links"
          >
            <span className="mr-2 text-xs uppercase tracking-[0.2em] text-slate-500">
              Connect
            </span>
            {roleLinks.map(({ label, url, icon: Icon }) =>
              url ? (
                <a
                  key={label}
                  href={url}
                  target={/^https?:\/\//i.test(url) ? "_blank" : undefined}
                  rel={/^https?:\/\//i.test(url) ? "noreferrer" : undefined}
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-slate-300 transition hover:border-cyan-300/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                >
                  <Icon size={17} aria-hidden="true" />
                </a>
              ) : (
                <span
                  key={label}
                  title={`${label} link to be added`}
                  aria-label={`${label} link to be added`}
                  className="grid h-10 w-10 place-items-center rounded-full border border-dashed border-white/10 text-slate-700"
                >
                  <Icon size={17} aria-hidden="true" />
                </span>
              ),
            )}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-violet-500/20 via-transparent to-cyan-400/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-violet-950/30 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <span className="font-mono text-xs text-slate-500">
                /gurbhej/portfolio
              </span>
              <span
                className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.85)]"
                aria-hidden="true"
              />
            </div>
            <div className="py-10">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-violet-300">
                Stack focus
              </p>
              <div className="mt-5 space-y-4 font-mono text-sm text-slate-300">
                {["Python", "React", "Node.js", "MongoDB"].map(
                  (item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 + index * 0.08 }}
                      className="flex items-center justify-between border-b border-white/5 pb-3"
                    >
                      <span>{item}</span>
                      <span className="text-xs text-cyan-300">
                        0{index + 1}
                      </span>
                    </motion.div>
                  ),
                )}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Build with intention</span>
              <ArrowDown size={15} aria-hidden="true" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
