import { motion } from "framer-motion";
import { BrainCircuit, Layers3, ServerCog, UserRound } from "lucide-react";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import PlaceholderText from "../components/PlaceholderText";

function AboutSection({ content }) {
  return (
    <section
      id="about"
      className="scroll-mt-28 border-t border-white/10 px-6 pb-24 pt-14 sm:px-10 lg:px-16"
    >
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.68fr_1.32fr] lg:items-center lg:gap-24">
        <Reveal>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="relative mx-auto w-full max-w-sm"
          >
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-violet-500/20 via-transparent to-cyan-400/15 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-3 shadow-2xl shadow-violet-950/30">
              {content.profilePhotoUrl ? (
                <img
                  src={content.profilePhotoUrl}
                  alt="Gurbhej Singh"
                  loading="lazy"
                  className="aspect-10 w-full rounded-3xl object-cover"
                />
              ) : (
                <div className="relative flex aspect-4/5 flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-violet-200/30 bg-linear-to-br from-violet-950/80 via-slate-900 to-cyan-950/70">
                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full border border-cyan-200/20" />
                  <div className="absolute -bottom-20 -left-12 h-48 w-48 rounded-full border border-violet-200/20" />
                  <div className="relative grid h-24 w-24 place-items-center rounded-[2rem] bg-gradient-to-br from-violet-300 to-cyan-200 text-3xl font-semibold text-slate-950 shadow-xl shadow-cyan-950/30">
                    GS
                  </div>
                  <UserRound
                    size={18}
                    className="relative mt-8 text-cyan-200"
                    aria-hidden="true"
                  />
                  <p className="relative mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">
                    Profile image placeholder
                  </p>
                </div>
              )}
              <div className="flex justify-center px-3 pb-2 pt-5 text-xs text-slate-500">
                <h1 className="font-semibold text-slate-400 text-xl">
                  Gurbhej Singh
                </h1>
              </div>
            </div>
          </motion.div>
        </Reveal>

        <div>
          <Reveal>
            <SectionHeading
              eyebrow="About"
              title="A developer who enjoys both sides of the stack."
              description="Frontend clarity and backend reliability are two parts of the same product experience."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <Reveal delay={0.08} className="h-full">
              <article className="h-full rounded-3xl border border-white/10 bg-white/[0.035] p-7">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/15 text-violet-200">
                    <Layers3 size={18} aria-hidden="true" />
                  </span>
                  <h3 className="font-semibold text-white">
                    Developer journey
                  </h3>
                </div>
                <p className="mt-5 text-base leading-8 text-slate-300">
                  <PlaceholderText>{content.about.journey}</PlaceholderText>
                </p>
              </article>
            </Reveal>
            <Reveal delay={0.16} className="h-full">
              <article className="h-full rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 to-cyan-400/[0.04] p-7">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-500/15 text-cyan-200">
                    <ServerCog size={18} aria-hidden="true" />
                  </span>
                  <h3 className="font-semibold text-white">
                    Frontend + backend
                  </h3>
                </div>
                <p className="mt-5 text-base leading-8 text-slate-300">
                  I enjoy connecting thoughtful interfaces with APIs and systems
                  that are structured, dependable, and easier to evolve.
                </p>
              </article>
            </Reveal>
          </div>
          <Reveal delay={0.22}>
            <div className="mt-5 flex gap-4 rounded-3xl border border-cyan-300/15 bg-cyan-300/[0.04] p-6">
              <span className="mt-1 text-cyan-200">
                <BrainCircuit size={21} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-white">
                  Problem-solving approach
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  I start by understanding the goal, break the problem into
                  smaller parts, and iterate toward a solution that is clear to
                  use and practical to maintain.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
