import { useEffect, useState } from 'react';
import { Edit3, LoaderCircle, Plus, Save, Trash2, X } from 'lucide-react';
import api from '../../services/api';

function defaultValue(field) {
  if (field.type === 'checkbox') return false;
  if (field.type === 'file') return null;
  if (field.type === 'array') return '';
  if (field.type === 'number') return field.nullable ? '' : 0;
  return '';
}

function formFromRecord(record, fields) {
  return Object.fromEntries(fields.map((field) => {
    const value = record?.[field.name];
    if (field.type === 'checkbox') return [field.name, Boolean(value)];
    if (field.type === 'array') return [field.name, Array.isArray(value) ? value.join(', ') : ''];
    return [field.name, value ?? defaultValue(field)];
  }));
}

function payloadFromForm(form, fields) {
  return Object.fromEntries(fields.filter((field) => field.type !== 'file').map((field) => {
    let value = form[field.name];
    if (field.type === 'array') value = value.split(',').map((item) => item.trim()).filter(Boolean);
    if (field.type === 'number') value = value === '' && field.nullable ? null : Number(value);
    if (field.type === 'checkbox') value = Boolean(value);
    return [field.name, value];
  }));
}

function Field({ field, value, onChange }) {
  if (field.type === 'checkbox') return <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300"><input type="checkbox" name={field.name} checked={Boolean(value)} onChange={onChange} className="h-4 w-4 accent-cyan-300" />{field.label}</label>;
  if (field.type === 'select') return <label className="grid gap-2 text-sm text-slate-300">{field.label}<select name={field.name} value={value} onChange={onChange} required={field.required} className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-cyan-300/60">{field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
  if (field.type === 'file') return <label className="grid gap-2 text-sm text-slate-300">{field.label}<span className="text-xs text-slate-500">{field.helpText || 'JPG, PNG, or WebP; maximum 5 MB.'}</span><input type="file" name={field.name} accept={field.accept} multiple={field.multiple} onChange={onChange} className="block w-full text-xs text-slate-400 file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-white/15" />{typeof value === 'string' && value && <a href={value} target="_blank" rel="noreferrer" className="text-xs text-cyan-200 hover:text-white">{field.currentLabel || 'View current file'}</a>}</label>;
  const Input = field.type === 'textarea' ? 'textarea' : 'input';
  return <label className="grid gap-2 text-sm text-slate-300">{field.label}{field.type === 'array' && <span className="text-xs text-slate-500">Comma-separated values</span>}<Input type={field.type === 'number' ? 'number' : field.type === 'url' ? 'url' : 'text'} name={field.name} value={value} onChange={onChange} required={field.required} min={field.min} max={field.max} rows={field.type === 'textarea' ? 4 : undefined} placeholder={field.placeholder} className="rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60" /></label>;
}

function ResourcePanel({ resource, title, description, records, fields, onReload }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(() => formFromRecord(null, fields));
  const [state, setState] = useState({ loading: false, error: '' });

  useEffect(() => { if (!editing) setForm(formFromRecord(null, fields)); }, [editing, fields]);

  function startNew() { setEditing(null); setForm(formFromRecord(null, fields)); setState({ loading: false, error: '' }); }
  function startEdit(record) { setEditing(record); setForm(formFromRecord(record, fields)); setState({ loading: false, error: '' }); }
  function updateField(event) { const { name, type, checked, value, files } = event.target; setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : type === 'file' ? (event.target.multiple ? Array.from(files || []) : files?.[0] || null) : value })); }

  async function submit(event) {
    event.preventDefault();
    setState({ loading: true, error: '' });
    try {
      const payload = payloadFromForm(form, fields);
      const response = editing?._id ? await api.put(`/admin/${resource}/${editing._id}`, payload) : await api.post(`/admin/${resource}`, payload);
      const savedRecord = response.data?.data;
      const fileField = fields.find((field) => field.type === 'file' && typeof field.upload === 'function');
      if (fileField && savedRecord?._id) {
        const files = form[fileField.name];
        const hasSelectedFiles = fileField.multiple
          ? Array.isArray(files) && files.length > 0
          : Boolean(files) && typeof files !== 'string';
        if (hasSelectedFiles) await fileField.upload(savedRecord._id, files);
      }
      setEditing(null);
      setState({ loading: false, error: '' });
      await onReload();
    } catch (error) {
      setState({ loading: false, error: error.response?.data?.message || 'Unable to save this record.' });
    }
  }

  async function remove(record) {
    if (!window.confirm(`Delete ${record.title || record.name || record.company || record.institution || 'this record'}?`)) return;
    setState({ loading: true, error: '' });
    try { await api.delete(`/admin/${resource}/${record._id}`); await onReload(); } catch (error) { setState({ loading: false, error: error.response?.data?.message || 'Unable to delete this record.' }); }
    setState((current) => ({ ...current, loading: false }));
  }

  return <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]"><section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><h2 className="text-xl font-semibold text-white">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{description}</p></div><button type="button" onClick={startNew} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-300/60 hover:text-white"><Plus size={15} aria-hidden="true" />Add record</button></div><div className="mt-7 space-y-3">{records.length ? records.map((record) => <div key={record._id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/30 p-4"><div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{record.title || record.name || record.company || record.institution}</p><p className="mt-1 truncate text-xs text-slate-500">{record.summary || record.category || record.issuer || record.degree || 'Record'}</p></div><div className="flex shrink-0 items-center gap-1"><button type="button" onClick={() => startEdit(record)} aria-label="Edit record" className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white"><Edit3 size={15} aria-hidden="true" /></button><button type="button" onClick={() => remove(record)} aria-label="Delete record" className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-rose-400/10 hover:text-rose-300"><Trash2 size={15} aria-hidden="true" /></button></div></div>) : <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-slate-500">No records yet. Add the first verified record.</div>}</div></section><section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">{editing ? 'Edit record' : 'New record'}</p><h2 className="mt-2 text-xl font-semibold text-white">{editing ? 'Update details' : 'Add details'}</h2></div>{editing && <button type="button" onClick={startNew} aria-label="Cancel editing" className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white"><X size={16} aria-hidden="true" /></button>}</div><form onSubmit={submit} className="mt-6 space-y-4">{fields.map((field) => <Field key={field.name} field={field} value={form[field.name]} onChange={updateField} />)}<p aria-live="polite" className="min-h-5 text-sm text-rose-300">{state.error}</p><button type="submit" disabled={state.loading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-wait disabled:opacity-60">{state.loading ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}{editing ? 'Update record' : 'Save record'}</button></form></section></div>;
}

export default ResourcePanel;
