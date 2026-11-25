import { useEffect, useRef, useState } from 'react';
import { ExternalLink, FileText, ImagePlus, LoaderCircle, Save, Upload } from 'lucide-react';
import api from '../../services/api';

const emptyContent = {
  hero: { headline: '', role: '', roles: '', introduction: '', primaryCtaLabel: '', primaryCtaUrl: '' },
  about: { summary: '', journey: '' },
  contact: { email: '', location: '', availability: '' },
  resumeUrl: '',
  profilePhotoUrl: '',
  socialLinks: '',
};

function formFromContent(content) {
  const hero = content?.hero || {};
  return {
    hero: { ...emptyContent.hero, ...hero, roles: (hero.roles || []).join(', ') },
    about: { ...emptyContent.about, ...(content?.about || {}) },
    contact: { ...emptyContent.contact, ...(content?.contact || {}) },
    resumeUrl: content?.resumeUrl || '',
    profilePhotoUrl: content?.profilePhotoUrl || '',
    socialLinks: (content?.socialLinks || []).map((link) => `${link.label}|${link.url}|${link.icon || ''}`).join('\n'),
  };
}

function parseSocialLinks(value) {
  const lines = value.split('\n').map((line) => line.trim()).filter(Boolean);
  const invalidLines = [];
  const links = [];

  lines.forEach((line, index) => {
    const [label = '', url = '', icon = ''] = line.split('|').map((part) => part.trim());
    let validUrl = false;
    try {
      validUrl = Boolean(url) && Boolean(new URL(url));
    } catch {
      validUrl = false;
    }

    if (!label || !validUrl) {
      invalidLines.push(index + 1);
      return;
    }
    links.push({ label, url, icon });
  });

  return { links, invalidLines };
}

function toPayload(form, socialLinks) {
  return {
    hero: { ...form.hero, roles: form.hero.roles.split(',').map((role) => role.trim()).filter(Boolean) },
    about: form.about,
    contact: form.contact,
    resumeUrl: form.resumeUrl,
    profilePhotoUrl: form.profilePhotoUrl,
    socialLinks,
  };
}

function getRequestError(error, fallback = 'Unable to save portfolio content.') {
  const response = error.response?.data;
  const issues = response?.details?.issues || [];
  if (issues.length) return `${response.message || 'Request validation failed.'} ${issues.map((issue) => `${issue.path || 'field'}: ${issue.message}`).join(' ')}`;
  return response?.message || fallback;
}

function UploadBox({ icon: Icon, title, description, accept, file, existingUrl, inputRef, loading, message, error, onFileChange, onUpload, buttonLabel }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
      <div className="flex items-start gap-3">
        <Icon size={18} className="mt-0.5 shrink-0 text-cyan-200" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>
      </div>
      <input ref={inputRef} type="file" accept={accept} onChange={onFileChange} className="mt-4 block w-full text-xs text-slate-400 file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-white/15" />
      {file && <p className="mt-3 truncate text-xs text-cyan-200">Selected: {file.name}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={onUpload} disabled={loading || !file} className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? <LoaderCircle size={14} className="animate-spin" aria-hidden="true" /> : <Upload size={14} aria-hidden="true" />}
          {buttonLabel}
        </button>
        {existingUrl && <a href={existingUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs text-slate-400 transition hover:text-white"><ExternalLink size={13} aria-hidden="true" />View current</a>}
      </div>
      <p aria-live="polite" className={`mt-3 text-xs ${error ? 'text-rose-300' : 'text-emerald-300'}`}>{error || message}</p>
    </div>
  );
}

function ContentPanel({ content, onSaved, onResumeImported }) {
  const [form, setForm] = useState(() => formFromContent(content));
  const [resumeFile, setResumeFile] = useState(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [state, setState] = useState({ loading: false, message: '', error: '' });
  const [resumeState, setResumeState] = useState({ loading: false, message: '', error: '' });
  const [profilePhotoState, setProfilePhotoState] = useState({ loading: false, message: '', error: '' });
  const resumeInputRef = useRef(null);
  const profilePhotoInputRef = useRef(null);

  useEffect(() => setForm(formFromContent(content)), [content]);

  const updateGroup = (group, event) => setForm((current) => ({ ...current, [group]: { ...current[group], [event.target.name]: event.target.value } }));
  const updateRoot = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    const parsedSocialLinks = parseSocialLinks(form.socialLinks);
    if (parsedSocialLinks.invalidLines.length) {
      setState({ loading: false, message: '', error: `Social link line${parsedSocialLinks.invalidLines.length > 1 ? 's' : ''} ${parsedSocialLinks.invalidLines.join(', ')} must use Label|https://url|Icon format, or be removed.` });
      return;
    }
    setState({ loading: true, message: '', error: '' });
    try {
      const response = await api.put('/admin/content', toPayload(form, parsedSocialLinks.links));
      onSaved(response.data?.data);
      setState({ loading: false, message: 'Portfolio content saved.', error: '' });
    } catch (error) {
      setState({ loading: false, message: '', error: getRequestError(error) });
    }
  }

  async function uploadResume() {
    if (!resumeFile) return setResumeState({ loading: false, message: '', error: 'Choose a PDF file first.' });
    if (!(resumeFile.type === 'application/pdf' || resumeFile.name.toLowerCase().endsWith('.pdf'))) return setResumeState({ loading: false, message: '', error: 'Only PDF files are allowed.' });
    if (resumeFile.size > 5 * 1024 * 1024) return setResumeState({ loading: false, message: '', error: 'The PDF must be 5 MB or smaller.' });

    const formData = new FormData();
    formData.append('resume', resumeFile);
    setResumeState({ loading: true, message: '', error: '' });
    try {
      const response = await api.post('/admin/content/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const savedContent = response.data?.data;
      setForm(formFromContent(savedContent));
      onSaved(savedContent);
      if (onResumeImported) void onResumeImported();
      setResumeFile(null);
      if (resumeInputRef.current) resumeInputRef.current.value = '';
      const imported = response.data?.imported || {};
      const importedSummary = [
        imported.skills ? `${imported.skills} skills` : '',
        imported.projects ? `${imported.projects} projects` : '',
        imported.experience ? `${imported.experience} experience record${imported.experience === 1 ? '' : 's'}` : '',
        imported.education ? `${imported.education} education record${imported.education === 1 ? '' : 's'}` : '',
      ].filter(Boolean).join(', ');
      setResumeState({ loading: false, message: importedSummary ? `Resume uploaded. Imported ${importedSummary}.` : 'Resume uploaded; no structured records were found.', error: '' });
    } catch (error) {
      setResumeState({ loading: false, message: '', error: getRequestError(error, 'Unable to upload resume.') });
    }
  }

  async function uploadProfilePhoto() {
    if (!profilePhotoFile) return setProfilePhotoState({ loading: false, message: '', error: 'Choose an image first.' });
    const validType = ['image/jpeg', 'image/png', 'image/webp'].includes(profilePhotoFile.type) || /\.(jpe?g|png|webp)$/i.test(profilePhotoFile.name);
    if (!validType) return setProfilePhotoState({ loading: false, message: '', error: 'Use a JPG, PNG, or WebP image.' });
    if (profilePhotoFile.size > 5 * 1024 * 1024) return setProfilePhotoState({ loading: false, message: '', error: 'The image must be 5 MB or smaller.' });

    const formData = new FormData();
    formData.append('profilePhoto', profilePhotoFile);
    setProfilePhotoState({ loading: true, message: '', error: '' });
    try {
      const response = await api.post('/admin/content/profile-photo', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const savedContent = response.data?.data;
      setForm(formFromContent(savedContent));
      onSaved(savedContent);
      setProfilePhotoFile(null);
      if (profilePhotoInputRef.current) profilePhotoInputRef.current.value = '';
      setProfilePhotoState({ loading: false, message: 'Profile photo uploaded and published.', error: '' });
    } catch (error) {
      setProfilePhotoState({ loading: false, message: '', error: getRequestError(error, 'Unable to upload profile photo.') });
    }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div><h2 className="text-xl font-semibold text-white">Portfolio content</h2><p className="mt-2 text-sm leading-6 text-slate-400">Update the copy, profile image, resume, and links shown across the public portfolio.</p></div>
        <button type="submit" disabled={state.loading} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-wait disabled:opacity-60">{state.loading ? <LoaderCircle size={15} className="animate-spin" aria-hidden="true" /> : <Save size={15} aria-hidden="true" />}Save content</button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="mb-4 text-sm font-semibold text-violet-200">Hero</legend>
            <label className="grid gap-2 text-sm text-slate-300">Headline<input name="headline" value={form.hero.headline} onChange={(event) => updateGroup('hero', event)} maxLength={160} className="admin-input" placeholder="Gurbhej Singh" /></label>
            <label className="grid gap-2 text-sm text-slate-300">Primary role<input name="role" value={form.hero.role} onChange={(event) => updateGroup('hero', event)} maxLength={120} className="admin-input" placeholder="Full-Stack Developer" /></label>
            <label className="grid gap-2 text-sm text-slate-300">Animated roles<span className="text-xs text-slate-500">Comma-separated roles; the first role is used as fallback.</span><input name="roles" value={form.hero.roles} onChange={(event) => updateGroup('hero', event)} maxLength={700} className="admin-input" placeholder="Full-Stack Developer, React Engineer" /></label>
            <label className="grid gap-2 text-sm text-slate-300">Introduction<textarea name="introduction" value={form.hero.introduction} onChange={(event) => updateGroup('hero', event)} rows={4} maxLength={1000} className="admin-input" /></label>
            <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm text-slate-300">CTA label<input name="primaryCtaLabel" value={form.hero.primaryCtaLabel} onChange={(event) => updateGroup('hero', event)} className="admin-input" /></label><label className="grid gap-2 text-sm text-slate-300">CTA URL<span className="text-xs text-slate-500">Use https://... or an internal anchor such as #projects.</span><input name="primaryCtaUrl" value={form.hero.primaryCtaUrl} onChange={(event) => updateGroup('hero', event)} type="text" className="admin-input" placeholder="#projects" /></label></div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-4 text-sm font-semibold text-fuchsia-200">Contact</legend>
            <label className="grid gap-2 text-sm text-slate-300">Public email<input name="email" value={form.contact.email} onChange={(event) => updateGroup('contact', event)} type="email" className="admin-input" /></label>
            <label className="grid gap-2 text-sm text-slate-300">Location<input name="location" value={form.contact.location} onChange={(event) => updateGroup('contact', event)} className="admin-input" /></label>
            <label className="grid gap-2 text-sm text-slate-300">Availability<textarea name="availability" value={form.contact.availability} onChange={(event) => updateGroup('contact', event)} rows={3} className="admin-input" /></label>
          </fieldset>
        </div>

        <div className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="mb-4 text-sm font-semibold text-cyan-200">About</legend>
            <label className="grid gap-2 text-sm text-slate-300">Summary<textarea name="summary" value={form.about.summary} onChange={(event) => updateGroup('about', event)} rows={5} maxLength={3000} className="admin-input" /></label>
            <label className="grid gap-2 text-sm text-slate-300">Journey<textarea name="journey" value={form.about.journey} onChange={(event) => updateGroup('about', event)} rows={5} maxLength={5000} className="admin-input" /></label>
            <UploadBox icon={ImagePlus} title="Attach profile photo" description="Shown in the About section. Use JPG, PNG, or WebP up to 5 MB." accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" file={profilePhotoFile} existingUrl={form.profilePhotoUrl} inputRef={profilePhotoInputRef} loading={profilePhotoState.loading} message={profilePhotoState.message} error={profilePhotoState.error} onFileChange={(event) => { setProfilePhotoFile(event.target.files?.[0] || null); setProfilePhotoState({ loading: false, message: '', error: '' }); }} onUpload={uploadProfilePhoto} buttonLabel="Upload photo" />
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-4 text-sm font-semibold text-amber-200">Resume and links</legend>
            <UploadBox icon={FileText} title="Attach resume PDF" description="Choose a PDF from your computer. Maximum file size: 5 MB." accept="application/pdf,.pdf" file={resumeFile} existingUrl={form.resumeUrl} inputRef={resumeInputRef} loading={resumeState.loading} message={resumeState.message} error={resumeState.error} onFileChange={(event) => { setResumeFile(event.target.files?.[0] || null); setResumeState({ loading: false, message: '', error: '' }); }} onUpload={uploadResume} buttonLabel="Upload PDF" />
            <label className="grid gap-2 text-sm text-slate-300">Social links<span className="text-xs text-slate-500">One per line: Label|URL|Icon (Github, LinkedIn, or Mail)</span><textarea name="socialLinks" value={form.socialLinks} onChange={updateRoot} rows={5} className="admin-input" placeholder="GitHub|https://github.com/username|Github" /></label>
          </fieldset>
        </div>
      </div>

      <div aria-live="polite" className={`mt-6 text-sm ${state.error ? 'text-rose-300' : 'text-emerald-300'}`}>{state.error || state.message}</div>
    </form>
  );
}

export default ContentPanel;
