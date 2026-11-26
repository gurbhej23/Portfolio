import { useState } from 'react';
import {
  Check,
  Circle,
  CornerDownLeft,
  ExternalLink,
  LoaderCircle,
  Mail,
  MessageSquare,
  Send,
  X,
} from 'lucide-react';
import api from '../../services/api';

const statuses = ['new', 'read', 'replied', 'archived'];

function MessagesPanel({ messages, onReload }) {
  const [updating, setUpdating] = useState('');
  const [activeReplyId, setActiveReplyId] = useState('');
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [feedback, setFeedback] = useState({ id: '', type: '', message: '' });
  const [error, setError] = useState('');

  async function updateStatus(id, status) {
    setUpdating(id);
    setError('');
    try {
      await api.patch(`/admin/messages/${id}/status`, { status });
      await onReload();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update message.');
    } finally {
      setUpdating('');
    }
  }

  function handleOpenReply(message) {
    if (activeReplyId === message._id) {
      setActiveReplyId('');
      setReplyText('');
    } else {
      setActiveReplyId(message._id);
      setReplyText(
        message.replyText
          ? `Hi ${message.name},\n\nFollowing up on our conversation:\n\nBest regards,\nGurbhej Singh`
          : `Hi ${message.name},\n\nThank you for reaching out! \n\nBest regards,\nGurbhej Singh`
      );
    }
    setFeedback({ id: '', type: '', message: '' });
  }

  async function handleSendReply(message) {
    if (!replyText.trim()) return;
    setSendingReply(true);
    setFeedback({ id: message._id, type: '', message: '' });

    try {
      const response = await api.post(`/admin/messages/${message._id}/reply`, {
        replyText: replyText.trim(),
      });

      const emailStatus = response.data?.data?.emailStatus;
      let msg = 'Reply saved and marked as replied.';
      if (emailStatus === 'sent') {
        msg = 'Reply email sent successfully!';
      } else if (emailStatus === 'not_configured') {
        msg = 'Reply saved. (Note: SMTP is not configured on Render, so no automated email was dispatched).';
      }

      setFeedback({ id: message._id, type: 'success', message: msg });
      setActiveReplyId('');
      setReplyText('');
      await onReload();
    } catch (requestError) {
      setFeedback({
        id: message._id,
        type: 'error',
        message: requestError.response?.data?.message || 'Unable to send reply.',
      });
    } finally {
      setSendingReply(false);
    }
  }

  function getMailtoHref(message) {
    const subject = encodeURIComponent(
      message.subject?.startsWith('Re:')
        ? message.subject
        : `Re: ${message.subject || 'Portfolio message'}`
    );
    const body = encodeURIComponent(
      `Hi ${message.name},\n\n\n\n--- Original Message ---\n${message.message}`
    );
    return `mailto:${message.email}?subject=${subject}&body=${body}`;
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Contact messages</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Review, reply, and track messages submitted through the public contact form.
          </p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-500/15 text-cyan-200">
          <MessageSquare size={18} aria-hidden="true" />
        </span>
      </div>

      {error && (
        <p className="mt-5 text-sm text-rose-300" role="alert">
          {error}
        </p>
      )}

      <div className="mt-7 space-y-4">
        {messages.length ? (
          messages.map((message) => {
            const isRead = Boolean(message.read ?? message.status !== 'new');
            const isReplying = activeReplyId === message._id;
            const currentFeedback = feedback.id === message._id ? feedback : null;

            return (
              <article
                key={message._id}
                className={`rounded-2xl border bg-slate-950/30 p-5 transition ${
                  isRead
                    ? 'border-white/10'
                    : 'border-cyan-300/30 shadow-lg shadow-cyan-950/10'
                }`}
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-white">
                        {message.subject || 'No subject'}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                          isRead
                            ? 'bg-white/10 text-slate-500'
                            : 'bg-cyan-300/15 text-cyan-200'
                        }`}
                      >
                        {isRead ? (
                          <Check size={11} aria-hidden="true" />
                        ) : (
                          <Circle size={8} fill="currentColor" aria-hidden="true" />
                        )}
                        {message.status || (isRead ? 'Read' : 'Unread')}
                      </span>
                    </div>
                    <p className="mt-2 flex items-center gap-2 text-xs text-cyan-200">
                      <Mail size={13} aria-hidden="true" />
                      {message.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      aria-label={`Set status for ${message.subject || 'message'}`}
                      value={message.status || (isRead ? 'read' : 'new')}
                      disabled={updating === message._id}
                      onChange={(event) => updateStatus(message._id, event.target.value)}
                      className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs capitalize text-slate-200 outline-none focus:border-cyan-300/60"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleOpenReply(message)}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                        isReplying
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:border-cyan-300/40 hover:text-white'
                      }`}
                    >
                      <CornerDownLeft size={13} aria-hidden="true" />
                      {isReplying ? 'Close' : 'Reply'}
                    </button>
                  </div>
                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                  {message.message}
                </p>

                {/* Previously sent reply display */}
                {message.replyText && (
                  <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-950/20 p-4">
                    <div className="flex items-center justify-between gap-2 text-xs font-semibold text-emerald-300">
                      <span className="flex items-center gap-1.5">
                        <Check size={13} aria-hidden="true" />
                        Your Reply
                      </span>
                      {message.repliedAt && (
                        <span className="text-slate-400 font-normal">
                          {new Date(message.repliedAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-xs leading-6 text-emerald-100/90">
                      {message.replyText}
                    </p>
                  </div>
                )}

                {/* Inline reply composer */}
                {isReplying && (
                  <div className="mt-4 rounded-xl border border-cyan-500/30 bg-slate-900/60 p-4">
                    <div className="flex items-center justify-between pb-2">
                      <span className="text-xs font-semibold text-cyan-200">
                        Reply to {message.name} ({message.email})
                      </span>
                      <a
                        href={getMailtoHref(message)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-200"
                        title="Open in your default email client or Gmail"
                      >
                        <ExternalLink size={12} aria-hidden="true" />
                        Open in Email App
                      </a>
                    </div>

                    <textarea
                      rows={4}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Write your reply to ${message.name}...`}
                      className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 p-3 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-300/60"
                    />

                    <div className="mt-3 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveReplyId('')}
                        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                      >
                        <X size={12} aria-hidden="true" />
                        Cancel
                      </button>

                      <button
                        type="button"
                        disabled={sendingReply || !replyText.trim()}
                        onClick={() => handleSendReply(message)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
                      >
                        {sendingReply ? (
                          <LoaderCircle size={13} className="animate-spin" aria-hidden="true" />
                        ) : (
                          <Send size={13} aria-hidden="true" />
                        )}
                        {sendingReply ? 'Sending...' : 'Send Reply'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Feedback status */}
                {currentFeedback && (
                  <p
                    className={`mt-3 text-xs ${
                      currentFeedback.type === 'error' ? 'text-rose-300' : 'text-emerald-300'
                    }`}
                  >
                    {currentFeedback.message}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-slate-500">
                  <span>
                    {message.name} · {new Date(message.createdAt).toLocaleString()}
                  </span>
                  {updating === message._id ? (
                    <LoaderCircle
                      size={14}
                      className="animate-spin text-cyan-300"
                      aria-label="Updating message"
                    />
                  ) : message.status === 'replied' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-300">
                      <Check size={13} aria-hidden="true" />
                      Replied
                    </span>
                  ) : null}
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-slate-500">
            No contact messages yet.
          </div>
        )}
      </div>
    </section>
  );
}

export default MessagesPanel;
