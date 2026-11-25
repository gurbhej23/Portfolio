function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-10xl">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-2xl">
        {title}
      </h2> 
      <p className="mt-2 text-lg leading-7 text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default SectionHeading;
