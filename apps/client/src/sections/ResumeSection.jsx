import { Eye, FileText } from "lucide-react";
import Reveal from "../components/Reveal";

function ResumeSection({ resumeUrl }) {
  return (
    <section id="resume" className="scroll-mt-28 px-4 py-12 sm:px-10 lg:px-16">
      <Reveal>
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 overflow-hidden rounded-[2rem] border border-violet-300/20 bg-gradient-to-r from-violet-500/15 via-white/[0.04] to-cyan-400/10 p-5 sm:flex-row sm:items-center sm:p-6 lg:p-7">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-violet-100">
              <FileText size={21} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                Resume
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                A concise version of the journey.
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                {resumeUrl
                  ? "Preview the current PDF resume."
                  : "A PDF resume can be added from the admin workspace when it is ready to publish."}
              </p>
            </div>
          </div>
          {resumeUrl ? (
            <div className="flex shrink-0 flex-wrap gap-3">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80"
              >
                <Eye size={16} aria-hidden="true" />
                Preview PDF
              </a>
            </div>
          ) : (
            <div className="flex shrink-0 flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-amber-200/25 px-5 py-3 text-sm font-semibold text-amber-200/70">
                <Eye size={16} aria-hidden="true" />
                Preview pending
              </span>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}

export default ResumeSection;
