import { useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  LoaderCircle,
  Mail,
  MapPin,
  Send,
} from "lucide-react";
import api from "../services/api";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { getEmailHref } from "../lib/portfolio";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

function validateForm(form) {
  const errors = {};
  if (form.name.trim().length < 2)
    errors.name = "Please enter at least 2 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (form.subject.trim().length > 180)
    errors.subject = "Subject must be 180 characters or fewer.";
  if (form.message.trim().length < 10)
    errors.message = "Please enter at least 10 characters.";
  if (form.message.length > 5000)
    errors.message = "Message must be 5000 characters or fewer.";
  return errors;
}

function ContactField({
  label,
  name,
  value,
  onChange,
  error,
  children,
  ...props
}) {
  return (
    <label className="grid gap-2 text-sm text-slate-300">
      {label}
      {children || (
        <input
          name={name}
          value={value}
          onChange={onChange}
          {...props}
          className={`rounded-xl border bg-slate-950/50 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60 ${error ? "border-rose-300/60" : "border-white/10"}`}
        />
      )}
      {error && (
        <span className="text-xs text-rose-300" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

function ContactSection({ contact }) {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState({ status: "idle", message: "" });
  const [errors, setErrors] = useState({});
  const emailHref = getEmailHref(contact.email);
  const emailIsExternal = /^https?:\/\//i.test(emailHref);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    if (state.status !== "idle") setState({ status: "idle", message: "" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const clientErrors = validateForm(form);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      setState({
        status: "error",
        message: "Please check the highlighted fields.",
      });
      return;
    }

    setErrors({});
    setState({ status: "loading", message: "" });
    try {
      const response = await api.post("/contact", form);
      setState({
        status: "success",
        message: response.data?.data?.message || "Your message was received.",
      });
      setForm(initialForm);
    } catch (error) {
      const serverFieldErrors =
        error.response?.data?.details?.fieldErrors || {};
      setErrors(
        Object.fromEntries(
          Object.entries(serverFieldErrors).map(([field, messages]) => [
            field,
            messages?.[0] || "Please check this field.",
          ]),
        ),
      );
      setState({
        status: "error",
        message:
          error.response?.data?.message ||
          "We could not send your message. Please try again.",
      });
    }
  }

  return (
    <section
      id="contact"
      className="scroll-mt-28 border-t border-white/10 px-6 py-24 sm:px-10 lg:px-16 lg:py-15"
    >
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
        <Reveal>
          <SectionHeading
            eyebrow="Contact"
            title="Have a good problem to solve?"
            description="Send a message through the form. It is validated, rate-limited, sanitized, and stored securely by the API."
          />
          <div className="mt-10 space-y-5">
            {contact.email && (
              <a
                href={emailHref}
                target={emailIsExternal ? "_blank" : undefined}
                rel={emailIsExternal ? "noreferrer" : undefined}
                className="flex items-center gap-3 text-sm text-slate-300 transition hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
              >
                <Mail size={17} className="text-cyan-300" aria-hidden="true" />
                {contact.email}
              </a>
            )}
            {contact.location && (
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <MapPin
                  size={17}
                  className="text-cyan-300"
                  aria-hidden="true"
                />
                {contact.location}
              </div>
            )}
            {contact.availability && (
              <p className="border-l border-violet-300/40 pl-4 text-sm leading-7 text-slate-400">
                {contact.availability}
              </p>
            )}
            {!contact.email && !contact.location && !contact.availability && (
              <p className="rounded-2xl border border-dashed border-amber-200/25 bg-amber-200/[0.03] p-5 text-sm leading-7 text-amber-100/70">
                Contact details can be added from the admin dashboard. The form
                remains available below.
              </p>
            )}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <ContactField
                label="Name"
                name="name"
                value={form.name}
                onChange={updateField}
                error={errors.name}
                required
                minLength={2}
                maxLength={120}
                autoComplete="name"
                placeholder="Your name"
              />
              <ContactField
                label="Email"
                name="email"
                value={form.email}
                onChange={updateField}
                error={errors.email}
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>
            <div className="mt-5">
              <ContactField
                label="Subject"
                name="subject"
                value={form.subject}
                onChange={updateField}
                error={errors.subject}
                maxLength={180}
                placeholder="What would you like to build?"
              />
            </div>
            <div className="mt-5">
              <ContactField
                label="Message"
                name="message"
                value={form.message}
                onChange={updateField}
                error={errors.message}
              >
                <textarea
                  name="message"
                  value={form.message}
                  onChange={updateField}
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={6}
                  placeholder="Tell me a little about the project or opportunity."
                  className={`resize-y rounded-xl border bg-slate-950/50 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 ${errors.message ? "border-rose-300/60" : "border-white/10"}`}
                />
              </ContactField>
            </div>
            <div
              className="absolute -left-[9999px] h-px w-px overflow-hidden"
              aria-hidden="true"
            >
              <label htmlFor="website">
                Website
                <input
                  id="website"
                  name="website"
                  value={form.website}
                  onChange={updateField}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p
                aria-live="polite"
                role={state.status === "error" ? "alert" : undefined}
                className={`min-h-5 text-sm ${state.status === "error" ? "text-rose-300" : state.status === "success" ? "text-emerald-300" : "text-slate-500"}`}
              >
                {state.status === "success" && (
                  <CheckCircle2
                    size={15}
                    className="mr-2 inline"
                    aria-hidden="true"
                  />
                )}
                {state.message}
              </p>
              <button
                type="submit"
                disabled={state.status === "loading"}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 disabled:cursor-wait disabled:opacity-60"
              >
                {state.status === "loading" ? (
                  <LoaderCircle
                    size={16}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Send size={16} aria-hidden="true" />
                )}
                Send message
                <ArrowUpRight size={15} aria-hidden="true" />
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

export default ContactSection;
