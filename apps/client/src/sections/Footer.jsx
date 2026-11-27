import { ArrowUp, Heart } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-8 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 text-xs text-slate-500 sm:flex-row sm:items-center">
        <p>
          © {new Date().getFullYear()} Gurbhej Singh. Built with{" "}
          <Heart
            size={12}
            className="mx-1 inline text-violet-300"
            fill="currentColor"
            aria-label="care"
          />{" "}
          and intention.
        </p>
        <a
          href="#top"
          className="inline-flex items-center gap-2 transition hover:text-white"
        >
          Back to top
          <ArrowUp size={14} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
