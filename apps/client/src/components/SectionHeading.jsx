function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-8xl">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
        {title}
      </h2> 
      <p className="mt-3 text-base leading-7 text-slate-500 sm:text-lg">
        {description}
      </p>
    </div>
  );
}

export default SectionHeading;
