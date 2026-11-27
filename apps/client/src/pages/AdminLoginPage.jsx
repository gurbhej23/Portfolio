import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, LoaderCircle, LockKeyhole, LogIn } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [state, setState] = useState({ loading: false, error: "" });
  const [showPassword, setShowPassword] = useState(false);
  const reducedMotion = useReducedMotion();

  if (user) return <Navigate to="/admin" replace />;

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setState({ loading: true, error: "" });
    try {
      await login(form.email, form.password);
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    } catch (error) {
      setState({
        loading: false,
        error: error.response?.data?.message || "Unable to sign in.",
      });
    }
  }

  return (
    <main className="admin-shell grid min-h-screen place-items-center overflow-hidden bg-[#080b13] px-6 py-12 text-slate-200">
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-violet-600/15 blur-3xl" /> 
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 shadow-2xl shadow-violet-950/30 backdrop-blur sm:p-9"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to portfolio
        </Link>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white text-center sm:text-4xl">
          Welcome
        </h1>
        <p className="mt-2 text-sm leading-7 text-slate-400">
          Sign in to manage portfolio content, projects, and messages.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="grid gap-2 text-sm text-slate-300">
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
              required
              autoComplete="email"
              className="rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60"
              placeholder="admin@example.com"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-300">
            Password
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={updateField}
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60"
                placeholder="Your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 grid w-12 place-items-center text-slate-500 transition hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-300/70"
              >
                {showPassword ? (
                  <EyeOff size={17} aria-hidden="true" />
                ) : (
                  <Eye size={17} aria-hidden="true" />
                )}
              </button>
            </div>
          </label>
          <button
            type="submit"
            disabled={state.loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white mt-4 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-wait disabled:opacity-60"
          >
            {state.loading ? (
              <LoaderCircle
                size={16}
                className="animate-spin"
                aria-hidden="true"
              />
            ) : (
              <LogIn size={16} aria-hidden="true" />
            )}
            Sign in
          </button>
        </form>
          <p aria-live="polite" className="min-h-5 text-sm text-rose-300">
            {state.error}
          </p>
      </motion.div>
    </main>
  );
}

export default AdminLoginPage;
