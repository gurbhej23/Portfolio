import {
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  FileCheck2,
  GraduationCap,
  Medal,
} from "lucide-react";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import PlaceholderText from "../components/PlaceholderText";

function EmptyJourney({ icon: Icon, title, description }) {
  return (
    <div className="rounded-3xl border border-dashed border-amber-200/25 bg-amber-200/[0.03] p-6">
      <Icon size={20} className="text-amber-200/80" aria-hidden="true" />
      <h3 className="mt-5 font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-amber-100/70">{description}</p>
    </div>
  );
}

function DateRange({ startDate, endDate, current }) {
  if (!startDate && !endDate && !current)
    return <span className="text-xs text-amber-200/70">[Add duration]</span>;
  return (
    <span className="inline-flex items-center gap-2 text-xs text-slate-500">
      <CalendarDays size={13} aria-hidden="true" />
      {startDate || "[Start date]"} —{" "}
      {current ? "Present" : endDate || "[End date]"}
    </span>
  );
}

function ExperienceTimeline({ experience }) {
  if (!experience.length)
    return (
      <EmptyJourney
        icon={BriefcaseBusiness}
        title="Experience details pending"
        description="Add verified roles, internships, dates, responsibilities, and technologies through the admin dashboard."
      />
    );

  return (
    <ol className="relative ml-2 border-l border-violet-300/20">
      {experience.map((item) => (
        <li key={item._id} className="relative pb-10 pl-8 last:pb-0">
          <span
            className="absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-[#111827] bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,.7)]"
            aria-hidden="true"
          />
          <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-5 transition hover:border-violet-300/30">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <h4 className="text-base font-semibold text-white">
                  {item.title || "[Add role]"}
                </h4>
                <p className="mt-1 text-sm text-cyan-200">
                  {item.company || "[Add company]"}
                </p>
              </div>
              <DateRange
                startDate={item.startDate}
                endDate={item.endDate}
                current={item.current}
              />
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-600">
              {item.employmentType || "[Add employment type]"}
            </p>
            <div className="mt-5">
              <h5 className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">
                Responsibilities
              </h5>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                <PlaceholderText>
                  {item.description ||
                    "[Add responsibilities and role context]"}
                </PlaceholderText>
              </p>
              {item.highlights?.length > 0 ? (
                <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-400">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300"
                        aria-hidden="true"
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-xs text-amber-200/70">
                  [Add responsibility highlights]
                </p>
              )}
            </div>
            <div className="mt-5">
              <h5 className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                Technologies used
              </h5>
              {item.technologies?.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-slate-400"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-xs text-amber-200/70">
                  [Add technologies used]
                </p>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function EducationList({ education }) {
  if (!education.length)
    return (
      <EmptyJourney
        icon={GraduationCap}
        title="Education details pending"
        description="Add verified qualifications, institutions, and completion years through the admin dashboard."
      />
    );
  return (
    <div className="space-y-6">
      {education.map((item) => (
        <div key={item._id} className="border-l border-cyan-300/20 pl-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
            Qualification
          </p>
          <h4 className="mt-2 text-base font-semibold text-slate-200">
            {item.degree || "[Add qualification]"}
          </h4>
          {item.field && (
            <p className="mt-1 text-sm text-slate-400">{item.field}</p>
          )}
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Institution
          </p>
          <p className="mt-2 text-sm text-slate-300">
            {item.institution || "[Add institution]"}
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Completion year
          </p>
          <p className="mt-2 text-sm text-slate-400">
            {item.endDate || "[Add completion year]"}
          </p>
          {item.description && (
            <p className="mt-4 text-sm leading-7 text-slate-400">
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function CertificationList({ certifications }) {
  if (!certifications.length)
    return (
      <EmptyJourney
        icon={Medal}
        title="Certifications pending"
        description="Add verified certifications and credential links when they are ready to publish."
      />
    );
  return (
    <div className="space-y-5">
      {certifications.map((item) => (
        <div key={item._id} className="flex gap-4">
          <span className="mt-1 text-fuchsia-200">
            <Medal size={16} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-200">
              {item.name || "[Add certification name]"}
            </p>
            <p className="mt-1 text-xs text-cyan-200">
              {item.issuer || "[Add issuing organization]"}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              {item.issueDate || "[Add issue date]"}
            </p>
            {item.credentialUrl ? (
              <a
                href={item.credentialUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-300 transition hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
              >
                View credential
                <ExternalLink size={13} aria-hidden="true" />
              </a>
            ) : (
              <span className="mt-3 inline-flex items-center gap-2 text-xs text-amber-200/70">
                <FileCheck2 size={13} aria-hidden="true" />
                Credential link pending
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function JourneySection({ experience, education, certifications }) {
  return (
    <section
      id="journey"
      className="scroll-mt-28 border-t border-white/10 px-6 pt-14 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Journey"
            title="A timeline that grows with the work."
            description="Experience, education, and certifications are editable through the admin workspace and remain intentionally empty until verified details are available."
          />
        </Reveal>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal delay={0.06} className="h-full">
            <article className="h-full rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
              <div className="mb-8 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/15 text-violet-200">
                  <BriefcaseBusiness size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-violet-200">
                    Professional path
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-white">
                    Experience
                  </h3>
                </div>
              </div>
              <ExperienceTimeline experience={experience} />
            </article>
          </Reveal>
          <div className="grid gap-6">
            <Reveal delay={0.12}>
              <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
                <div className="mb-6 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-500/15 text-cyan-200">
                    <GraduationCap size={18} aria-hidden="true" />
                  </span>
                  <h3 className="font-semibold text-white">Education</h3>
                </div>
                <EducationList education={education} />
              </article>
            </Reveal>
            <Reveal delay={0.18}>
              <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
                <div className="mb-6 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-fuchsia-500/15 text-fuchsia-200">
                    <Medal size={18} aria-hidden="true" />
                  </span>
                  <h3 className="font-semibold text-white">Certifications</h3>
                </div>
                <CertificationList certifications={certifications} />
              </article>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default JourneySection;
