import { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  FileText,
  FolderKanban,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  Settings2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import ResourcePanel from "../components/admin/ResourcePanel";
import ContentPanel from "../components/admin/ContentPanel";
import MessagesPanel from "../components/admin/MessagesPanel";

async function uploadProjectImage(projectId, file) {
  const formData = new FormData();
  formData.append("image", file);
  return api.post(`/admin/projects/${projectId}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

async function uploadCertificationAttachment(certificationId, file) {
  const formData = new FormData();
  formData.append("certificate", file);
  return api.post(
    `/admin/certifications/${certificationId}/attachment`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
}

const resourceConfigs = {
  projects: {
    title: "Projects",
    description: "Manage the work displayed on the public portfolio.",
    fields: [
      {
        name: "title",
        label: "Title",
        required: true,
        placeholder: "Project name",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
      {
        name: "imageUrl",
        label: "Screenshot",
        type: "file",
        accept: "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp",
        upload: uploadProjectImage,
      },
      { name: "technologies", label: "Technologies", type: "array" },
      { name: "githubUrl", label: "GitHub URL", type: "url" },
      { name: "liveUrl", label: "Live URL", type: "url" },
    ],
  },
  skills: {
    title: "Skills",
    description:
      "Organize technical skills and optionally provide verified proficiency levels.",
    fields: [
      { name: "name", label: "Skill name", required: true },
      {
        name: "category",
        label: "Category",
        required: true,
        placeholder: "Frontend, Backend, Tools",
      },
      {
        name: "proficiency",
        label: "Proficiency (optional)",
        type: "number",
        min: 0,
        max: 100,
        nullable: true,
      },
    ],
  },
  experience: {
    title: "Experience",
    description:
      "Add verified roles, internships, responsibilities, and technologies.",
    fields: [
      { name: "company", label: "Company", required: true },
      { name: "title", label: "Role", required: true },
      { name: "employmentType", label: "Employment type" },
      { name: "location", label: "Location" },
      { name: "startDate", label: "Start date" },
      { name: "endDate", label: "End date" },
      { name: "current", label: "Current role", type: "checkbox" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "highlights", label: "Highlights", type: "array" },
      { name: "technologies", label: "Technologies", type: "array" },
    ],
  },
  education: {
    title: "Education",
    description: "Add verified institutions, degrees, dates, and context.",
    fields: [
      { name: "institution", label: "Institution", required: true },
      { name: "degree", label: "Degree", required: true },
      { name: "field", label: "Field of study" },
      { name: "startDate", label: "Start date" },
      { name: "endDate", label: "End date" },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  certifications: {
    title: "Certifications",
    description:
      "Keep certifications accurate and attach the certificate file when available.",
    fields: [
      { name: "name", label: "Certification", required: true },
      { name: "issuer", label: "Issuer", required: true },
      { name: "issueDate", label: "Issue date" },
      {
        name: "credentialUrl",
        label: "Certificate attachment",
        type: "file",
        accept:
          "application/pdf,image/jpeg,image/png,image/webp,.pdf,.jpg,.jpeg,.png,.webp",
        helpText: "PDF, JPG, PNG, or WebP; maximum 5 MB.",
        currentLabel: "View current certificate",
        upload: uploadCertificationAttachment,
      },
    ],
  },
};

const navigation = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "content", label: "Portfolio content", icon: FileText },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "experience", label: "Experience", icon: BriefcaseBusiness },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "certifications", label: "Certifications", icon: BookOpen },
  { id: "messages", label: "Messages", icon: Inbox },
];

const initialData = {
  stats: {},
  content: null,
  projects: [],
  skills: [],
  experience: [],
  education: [],
  certifications: [],
  messages: [],
};

function StatCard({ label, value, icon: Icon, accent }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={reducedMotion ? undefined : { y: -3 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"
    >
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${accent}`}>
        <Icon size={18} aria-hidden="true" />
      </div>
      <p className="mt-6 text-3xl font-semibold text-white">{value ?? 0}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </motion.div>
  );
}

function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState("overview");
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [error, setError] = useState("");
  const [ownerPhotoError, setOwnerPhotoError] = useState(false);

  const ownerName = data.content?.hero?.headline?.trim() || "Gurbhej Singh";
  const ownerPhotoUrl = data.content?.profilePhotoUrl || "";

  useEffect(() => {
    setOwnerPhotoError(false);
  }, [ownerPhotoUrl]);

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const [
        stats,
        content,
        projects,
        skills,
        experience,
        education,
        certifications,
        messages,
      ] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/content"),
        api.get("/admin/projects"),
        api.get("/admin/skills"),
        api.get("/admin/experience"),
        api.get("/admin/education"),
        api.get("/admin/certifications"),
        api.get("/admin/messages"),
      ]);
      setData({
        stats: stats.data?.data || {},
        content: content.data?.data || null,
        projects: projects.data?.data || [],
        skills: skills.data?.data || [],
        experience: experience.data?.data || [],
        education: education.data?.data || [],
        certifications: certifications.data?.data || [],
        messages: messages.data?.data || [],
      });
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        await logout();
        navigate("/admin/login", { replace: true });
        return;
      }
      setError(
        requestError.response?.data?.message ||
          "Unable to load dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function reloadResource(resource) {
    const response = await api.get(`/admin/${resource}`);
    setData((current) => ({
      ...current,
      [resource]: response.data?.data || [],
    }));
  }

  async function reloadMessages() {
    await reloadResource("messages");
  }
  async function saveContent(content) {
    setData((current) => ({ ...current, content }));
  }

  async function refreshImportedData() {
    try {
      const [stats, content, projects, skills, experience, education] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/content"),
        api.get("/admin/projects"),
        api.get("/admin/skills"),
        api.get("/admin/experience"),
        api.get("/admin/education"),
      ]);
      setData((current) => ({
        ...current,
        stats: stats.data?.data || current.stats,
        content: content.data?.data || current.content,
        projects: projects.data?.data || [],
        skills: skills.data?.data || [],
        experience: experience.data?.data || [],
        education: education.data?.data || [],
      }));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Imported resume data could not be refreshed.");
    }
  }

  async function signOut() {
    await logout();
    navigate("/admin/login", { replace: true });
  }
  function chooseSection(section) {
    setActive(section);
    setMobileNavOpen(false);
  }

  const activeNav = navigation.find((item) => item.id === active);
  const ActiveIcon = activeNav?.icon || LayoutDashboard;

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="admin-shell min-h-screen bg-[#080b13] text-slate-200"
    >
      <motion.aside
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.06 }}
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-slate-950/95 p-5 backdrop-blur-xl transition-transform lg:translate-x-0 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between">
          <Link
            to="/admin"
            className="flex min-w-0 items-center gap-3 text-sm font-semibold text-white"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-400 to-cyan-300 text-xs text-slate-950">
              {ownerPhotoUrl && !ownerPhotoError ? (
                <img
                  src={ownerPhotoUrl}
                  alt=""
                  onError={() => setOwnerPhotoError(true)}
                  className="h-15 w-25 object-cover"
                />
              ) : (
                "GS"
              )}
            </span>
            <span className="truncate">{ownerName}</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 lg:hidden"
            aria-label="Close dashboard navigation"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="mt-10 rounded-2xl border border-violet-300/15 bg-violet-400/[0.06] p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck
              size={17}
              className="text-cyan-200"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {user?.email}
              </p>
              <p className="mt-1 text-xs capitalize text-slate-500">
                {user?.role} access
              </p>
            </div>
          </div>
        </div>
        <nav className="mt-8 space-y-1" aria-label="Admin sections">
          {navigation.map(({ id, label, icon: Icon }, index) => (
            <motion.button
              type="button"
              key={id}
              onClick={() => chooseSection(id)}
              initial={reducedMotion ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={reducedMotion ? undefined : { x: 3 }}
              transition={{
                duration: 0.28,
                delay: reducedMotion ? 0 : index * 0.04,
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${active === id ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
            >
              <Icon size={16} aria-hidden="true" />
              {label}
              {id === "messages" && data.stats.unreadMessages > 0 && (
                <span className="ml-auto rounded-full bg-cyan-300 px-2 py-0.5 text-[10px] font-bold text-slate-950">
                  {data.stats.unreadMessages}
                </span>
              )}
            </motion.button>
          ))}
        </nav>
        <div className="absolute inset-x-5 bottom-5 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <PanelLeftClose size={16} aria-hidden="true" />
            View portfolio
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-rose-400/10 hover:text-rose-300"
          >
            <LogOut size={16} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </motion.aside>
      <div className="lg:pl-72">
        <motion.header
          initial={reducedMotion ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.12 }}
          className="sticky top-0 z-40 border-b border-white/10 bg-[#080b13]/85 px-5 py-4 backdrop-blur-xl sm:px-8"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-300 lg:hidden"
                aria-label="Open dashboard navigation"
              >
                <Menu size={18} aria-hidden="true" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
                  Admin dashboard
                </p>
                <h1 className="mt-1 flex items-center gap-2 text-xl font-semibold text-white">
                  <ActiveIcon
                    size={18}
                    className="text-violet-200"
                    aria-hidden="true"
                  />
                  {activeNav?.label}
                </h1>
              </div>
            </div>
            <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
              <Settings2 size={14} aria-hidden="true" />
              Private workspace
            </div>
          </div>
        </motion.header>
        <motion.main
          key={loading ? "loading" : active}
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="px-5 py-8 sm:px-8 sm:py-10"
        >
          {error && (
            <div className="mb-6 rounded-2xl border border-rose-300/20 bg-rose-300/[0.06] px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}
          {loading ? (
            <div className="grid min-h-[50vh] place-items-center">
              <div className="text-center">
                <BarChart3
                  size={28}
                  className="mx-auto animate-pulse text-cyan-300"
                  aria-hidden="true"
                />
                <p className="mt-4 text-sm text-slate-500">
                  Loading workspace data…
                </p>
              </div>
            </div>
          ) : active === "overview" ? (
            <section>
              <div className="mb-8">
                <p className="text-sm text-slate-500">
                  A quick view of the portfolio workspace.
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                  Good to see you.
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  label="Published projects"
                  value={data.stats.projects}
                  icon={FolderKanban}
                  accent="bg-violet-500/15 text-violet-200"
                />
                <StatCard
                  label="Featured projects"
                  value={data.stats.featuredProjects}
                  icon={Sparkles}
                  accent="bg-cyan-500/15 text-cyan-200"
                />
                <StatCard
                  label="Skills managed"
                  value={data.stats.skills}
                  icon={BarChart3}
                  accent="bg-fuchsia-500/15 text-fuchsia-200"
                />
                <StatCard
                  label="Unread messages"
                  value={data.stats.unreadMessages}
                  icon={Inbox}
                  accent="bg-amber-500/15 text-amber-200"
                />
              </div>
              <div className="mt-6">
                <MessagesPanel
                  messages={data.messages.slice(0, 3)}
                  onReload={reloadMessages}
                />
              </div>
            </section>
          ) : active === "content" ? (
            <ContentPanel content={data.content} onSaved={saveContent} onResumeImported={refreshImportedData} />
          ) : active === "messages" ? (
            <MessagesPanel messages={data.messages} onReload={reloadMessages} />
          ) : (
            <ResourcePanel
              resource={active}
              {...resourceConfigs[active]}
              records={data[active]}
              onReload={() => reloadResource(active)}
            />
          )}
        </motion.main>
      </div>
    </motion.div>
  );
}

export default AdminDashboardPage;
