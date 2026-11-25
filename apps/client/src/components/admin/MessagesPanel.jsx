import { useState } from 'react';
import { Check, Circle, LoaderCircle, Mail, MessageSquare } from 'lucide-react';
import api from '../../services/api';

const statuses = ['new', 'read', 'replied', 'archived'];

function MessagesPanel({ messages, onReload }) {
  const [updating, setUpdating] = useState('');
  const [error, setError] = useState('');

  async function updateStatus(id, status) {
    setUpdating(id); setError('');
    try { await api.patch(`/admin/messages/${id}/status`, { status }); await onReload(); } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to update message.'); } finally { setUpdating(''); }
  }

  return <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"><div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-semibold text-white">Contact messages</h2><p className="mt-2 text-sm leading-6 text-slate-400">Review, mark, and track messages submitted through the public contact form.</p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-500/15 text-cyan-200"><MessageSquare size={18} aria-hidden="true" /></span></div>{error && <p className="mt-5 text-sm text-rose-300" role="alert">{error}</p>}<div className="mt-7 space-y-4">{messages.length ? messages.map((message) => { const isRead = Boolean(message.read ?? message.status !== 'new'); return <article key={message._id} className={`rounded-2xl border bg-slate-950/30 p-5 ${isRead ? 'border-white/10' : 'border-cyan-300/30 shadow-lg shadow-cyan-950/10'}`}><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold text-white">{message.subject || 'No subject'}</p><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${isRead ? 'bg-white/10 text-slate-500' : 'bg-cyan-300/15 text-cyan-200'}`}>{isRead ? <Check size={11} aria-hidden="true" /> : <Circle size={8} fill="currentColor" aria-hidden="true" />}{isRead ? 'Read' : 'Unread'}</span></div><p className="mt-2 flex items-center gap-2 text-xs text-cyan-200"><Mail size={13} aria-hidden="true" />{message.email}</p></div><select aria-label={`Set status for ${message.subject || 'message'}`} value={message.status || (isRead ? 'read' : 'new')} disabled={updating === message._id} onChange={(event) => updateStatus(message._id, event.target.value)} className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs capitalize text-slate-200 outline-none focus:border-cyan-300/60">{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></div><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">{message.message}</p><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-slate-500"><span>{message.name} · {new Date(message.createdAt).toLocaleString()}</span>{updating === message._id ? <LoaderCircle size={14} className="animate-spin text-cyan-300" aria-label="Updating message" /> : message.status === 'replied' ? <span className="inline-flex items-center gap-1 text-emerald-300"><Check size={13} aria-hidden="true" />Replied</span> : null}</div></article>; }) : <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-slate-500">No contact messages yet.</div>}</div></section>;
}

export default MessagesPanel;
