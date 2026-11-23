"use client";

import { useState, type FormEvent } from "react";
import { LoadError } from "@/components/admin/LoadError";
import { ADMIN_TEXT, CONVERSATIONS_TEXT } from "@/content/admin";
import { sendStaffMessage } from "@/lib/admin-api";
import { useConversations, useGuestNames, useMessages } from "@/hooks/admin/useAdminData";

const formatDate = (date: Date | null) => (date ? date.toLocaleString() : ADMIN_TEXT.noDate);

export function ConversationsTab() {
  const list = useConversations();
  const [selected, setSelected] = useState<string>();
  const thread = useMessages(selected);
  const names = useGuestNames(list.data?.map((c) => c.uid) ?? []);
  const conversations = list.data;
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);

  async function send(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!selected || !text || sending) return;
    setSending(true);
    setSendError(false);
    try {
      await sendStaffMessage(selected, text);
      setDraft(""); // the live query shows the new message
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  }

  if (list.error) return <LoadError message={list.error} onRetry={list.retry} />;
  if (!conversations) return <p className="text-muted">{ADMIN_TEXT.loading}</p>;
  if (conversations.length === 0) return <p className="text-muted">{CONVERSATIONS_TEXT.empty}</p>;

  const selectedName = selected ? names[conversations.find((c) => c.id === selected)?.uid ?? ""] : undefined;

  return (
    <div className="grid h-[70vh] overflow-hidden @4xl:h-[calc(100dvh-6.5rem)] rounded-2xl border border-line bg-surface @4xl:grid-cols-[320px_1fr]">
      <ul
        aria-label={CONVERSATIONS_TEXT.listLabel}
        className={`overflow-y-auto border-line @4xl:block @4xl:border-r ${selected ? "hidden" : "block"}`}
      >
        {conversations.map((c) => {
          const name = names[c.uid] ?? ADMIN_TEXT.loading;
          return (
            <li key={c.id}>
              <button
                type="button"
                aria-pressed={c.id === selected}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left ${c.id === selected ? "bg-brand-soft" : "hover:bg-bg"}`}
                onClick={() => { setSelected(c.id); setSendError(false); }}
              >
                <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-full bg-brand font-semibold text-white">
                  {name[0]}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{name}</span>
                  <span className="block truncate text-sm text-muted">
                    {CONVERSATIONS_TEXT.messages(c.messageCount)} · {formatDate(c.updatedAt)}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <section className={`min-h-0 flex-col @4xl:flex ${selected ? "flex" : "hidden"}`}>
        {!selected && <p className="m-auto mt-8 text-muted">{CONVERSATIONS_TEXT.choose}</p>}
        {selected && (
          <header className="flex items-center gap-2 border-b border-line px-4 py-3 font-semibold">
            <button type="button" aria-label={CONVERSATIONS_TEXT.back} className="text-xl @4xl:hidden" onClick={() => setSelected(undefined)}>
              ←
            </button>
            {selectedName ?? ADMIN_TEXT.loading}
          </header>
        )}
        <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto p-4">
          {thread.loading && <p className="text-muted">{ADMIN_TEXT.loading}</p>}
          <LoadError message={thread.error} onRetry={thread.retry} />
          {thread.data?.length === 0 && <p className="text-muted">{CONVERSATIONS_TEXT.emptyThread}</p>}
          {thread.data?.map((m) => {
            const guest = m.role === "user";
            return (
              <div key={m.id} className={`max-w-[75%] ${guest ? "self-start" : "self-end"}`}>
                <p
                  title={`${CONVERSATIONS_TEXT.roles[m.role] ?? m.role} · ${formatDate(m.createdAt)}`}
                  className={`whitespace-pre-wrap break-words rounded-2xl px-3 py-2 ${guest ? "bg-line" : m.role === "staff" ? "bg-brand text-white" : "bg-brand-soft"}`}
                >
                  {m.content}
                </p>
              </div>
            );
          })}
        </div>
        {selected && (
          <form onSubmit={send} className="border-t border-line p-3">
            {sendError && <p role="alert" className="mb-2 text-sm text-accent">{CONVERSATIONS_TEXT.sendFailed}</p>}
            <div className="flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={1000}
                placeholder={CONVERSATIONS_TEXT.placeholder}
                aria-label={CONVERSATIONS_TEXT.placeholder}
                className="min-w-0 flex-1 rounded-full border border-line bg-bg px-4 py-2"
              />
              <button type="submit" disabled={sending || !draft.trim()} className="rounded-full bg-brand px-5 font-semibold text-white disabled:opacity-50">
                {CONVERSATIONS_TEXT.send}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
