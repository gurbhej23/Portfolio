import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const navigation = [
  ["Skills", "skills"],
  ["Projects", "projects"],
  ["Journey", "journey"],
  ["About", "about"],
  ["Contact", "contact"],
];

function PortfolioNav({ activeSection = "top", content }) {
  const [open, setOpen] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const closeMenu = () => setOpen(false);
  const profilePhotoUrl = content?.profilePhotoUrl || "";

  useEffect(() => setPhotoError(false), [profilePhotoUrl]);

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8"
      aria-label="Primary navigation"
    >
      <div className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-6">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3 text-sm font-semibold tracking-wide text-white"
          >
            <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-400 to-cyan-300 text-xs text-slate-950">
              {profilePhotoUrl && !photoError ? (
                <img
                  src={profilePhotoUrl}
                  alt=""
                  onError={() => setPhotoError(true)}
                  className="h-11 w-11 object-cover"
                />
              ) : (
                "GS"
              )}
              <span className="sr-only"> home</span>
            </span>
            <span>Gurbhej Singh</span>
          </Link>
          <div className="hidden items-center gap-7 md:flex">
            {navigation.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={activeSection === id ? "page" : undefined}
                className={`relative py-2 text-sm transition after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-cyan-300 after:transition-transform ${activeSection === id ? "text-white after:scale-x-100" : "text-slate-400 after:scale-x-0 hover:text-white hover:after:scale-x-100"}`}
              >
                {label}
              </a>
            ))}
          </div>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-300 transition hover:border-cyan-300/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          >
            {open ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
        </div>
        {open && (
          <div
            id="mobile-navigation"
            className="border-t border-white/10 pb-2 pt-4 md:hidden"
          >
            <div className="grid gap-1">
              {navigation.map(([label, id]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={closeMenu}
                  aria-current={activeSection === id ? "page" : undefined}
                  className={`rounded-xl px-3 py-3 text-sm hover:bg-white/5 hover:text-white ${activeSection === id ? "bg-white/10 text-white" : "text-slate-300"}`}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default PortfolioNav;
