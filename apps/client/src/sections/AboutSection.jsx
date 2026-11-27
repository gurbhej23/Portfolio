import { BrainCircuit, Layers3, ServerCog } from "lucide-react";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import PlaceholderText from "../components/PlaceholderText";

function AboutSection({ content }) {
  return (
    <section
      id="about"
      className="scroll-mt-28 border-t border-white/10 px-4 pb-14 pt-14 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <div>
          <Reveal>
            <SectionHeading
              eyebrow="About"
              title="A developer who enjoys both sides of the stack."
              description="Frontend clarity and backend reliability are two parts of the same product experience."
            />
          </Reveal>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Reveal delay={0.08} className="h-full">
              <article className="h-full rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-7">
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
              <article className="h-full rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 to-cyan-400/[0.04] p-5 sm:p-7">
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
            <div className="mt-5 flex items-start gap-3 rounded-3xl border border-cyan-300/15 bg-cyan-300/[0.04] p-5 sm:gap-4 sm:p-6">
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
