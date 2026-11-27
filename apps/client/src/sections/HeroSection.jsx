import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { getEmailHref, isPlaceholder } from "../lib/portfolio";

const iconMap = { Github, LinkedIn: Linkedin, Linkedin, Mail };

function HeroSection({ content }) {
  const { hero, socialLinks, contact } = content;
  const reducedMotion = useReducedMotion();
  const profilePhotoUrl = content.profilePhotoUrl || "";
  const [photoError, setPhotoError] = useState(false);
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

  useEffect(() => {
    setPhotoError(false);
  }, [profilePhotoUrl]);

  const currentRole = roles[roleIndex] || hero.role;
  const introduction = hero.introduction || "";
  const introductionLimit = 280;
  const introductionHasMore = introduction.length > introductionLimit;
  const visibleIntroduction =
    introductionHasMore && !introductionExpanded
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
      className="relative flex min-h-screen items-center overflow-hidden px-4 pb-8 pt-28 sm:px-6 sm:pb-20 lg:px-16 lg:pb-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
      <motion.div
        className="pointer-events-none absolute -left-40 top-24 h-[20rem] w-[20rem] rounded-full bg-violet-600/20 blur-3xl sm:h-[30rem] sm:w-[30rem]"
        animate={
          reducedMotion
            ? undefined
            : { x: [0, 45, 0], y: [0, -30, 0], scale: [1, 1.08, 1] }
        }
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-40 bottom-0 h-[22rem] w-[22rem] rounded-full bg-cyan-400/10 blur-3xl sm:h-[34rem] sm:w-[34rem]"
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
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] lg:items-center lg:gap-16">
        <div className="order-2 lg:order-1">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[1.25rem] font-semibold uppercase tracking-[0.32em] text-cyan-300"
          >
            Hello, I&apos;m
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            {hero.headline}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-4 flex min-h-12 flex-wrap items-center gap-3 text-xl font-medium text-slate-300 sm:min-h-16 sm:text-3xl lg:text-4xl"
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
            className="mt-3 max-w-2xl"
          >
            <motion.div
              id="hero-introduction"
              layout
              transition={{ layout: { duration: 0.35, ease: "easeInOut" } }}
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.p
                  key={introductionExpanded ? "expanded" : "collapsed"}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`text-base leading-7 sm:text-lg sm:leading-8 ${isPlaceholder(introduction) ? "text-amber-200/80" : "text-slate-300"}`}
                >
                  {visibleIntroduction}
                  {introductionHasMore && (
                    <>
                      {" "}
                      <button
                        type="button"
                        onClick={() =>
                          setIntroductionExpanded((expanded) => !expanded)
                        }
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
            className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          >
            <a
              href={primaryCtaUrl}
              target={primaryCtaIsExternal ? "_blank" : undefined}
              rel={primaryCtaIsExternal ? "noreferrer" : undefined}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 sm:w-auto"
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
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-violet-300/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/80 sm:w-auto"
            >
              Download Resume
              <ArrowDown size={16} aria-hidden="true" />
            </a>
          </motion.div>
          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            aria-label="Professional links"
          >
            {/* <span className="mr-2 text-xs uppercase tracking-[0.2em] text-slate-500">
              Connect
            </span> */}
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
          className="relative order-1 mx-auto w-full max-w-xs sm:max-w-sm lg:order-2"
        >
          <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-violet-500/20 via-transparent to-cyan-400/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-3 shadow-2xl shadow-violet-950/30 backdrop-blur-sm">
            {profilePhotoUrl && !photoError ? (
              <img
                src={profilePhotoUrl}
                alt="Gurbhej Singh"
                loading="eager"
                fetchpriority="high"
                onError={() => setPhotoError(true)}
                className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
              />
            ) : (
              <div className="relative flex aspect-[4/5] flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border border-dashed border-violet-200/30 bg-gradient-to-br from-violet-950/80 via-slate-900 to-cyan-950/70">
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full border border-cyan-200/20" />
                <div className="absolute -bottom-20 -left-12 h-48 w-48 rounded-full border border-violet-200/20" />
                <div className="relative grid h-24 w-24 place-items-center rounded-[2rem] bg-gradient-to-br from-violet-300 to-cyan-200 text-3xl font-semibold text-slate-950 shadow-xl shadow-cyan-950/30">
                  GS
                </div>
                <p className="relative mt-6 text-xs uppercase tracking-[0.2em] text-slate-400">
                  Profile image
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
