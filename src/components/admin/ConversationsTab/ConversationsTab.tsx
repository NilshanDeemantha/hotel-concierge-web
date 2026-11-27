"use client";

import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { LoadError } from "@/components/admin/LoadError";
import { PayButton } from "@/components/chat/PayButton";
import { Photo } from "@/components/ui/Photo";
import { ADMIN_TEXT, CONVERSATIONS_TEXT } from "@/content/admin";
import { CHAT_TEXT } from "@/content/chat";
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

  async function send(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!selected || !text || sending) return;
    setSending(true);
    try {
      await conversations?.find((c) => c.id === selected)?.sendStaffMessage(text);
      setDraft(""); // the live query shows the new message
    } catch {
      toast.error(CONVERSATIONS_TEXT.sendFailed);
    } finally {
      setSending(false);
    }
  }

  if (list.error) return <LoadError message={list.error} onRetry={list.retry} />;
  if (!conversations) return <p className="text-muted">{ADMIN_TEXT.loading}</p>;
  if (conversations.length === 0) return <p className="text-muted">{CONVERSATIONS_TEXT.empty}</p>;

  const selectedName = selected ? names[conversations.find((c) => c.id === selected)?.uid ?? ""] : undefined;

  return (
    <div className="grid h-[calc(100dvh-11rem)] overflow-hidden md:h-[calc(100dvh-6.5rem)] rounded-2xl border border-line bg-surface @4xl:grid-cols-[320px_1fr]">
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
                onClick={() => setSelected(c.id)}
              >
                <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-full bg-brand font-semibold text-white">
                  {name[0]}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{name}</span>
                  <span className="block truncate text-sm text-muted">
                    {c.messageLabel} · {formatDate(c.updatedAt)}
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
            const guest = m.isGuest;
            return (
              <div key={m.id} className={`flex max-w-[75%] flex-col gap-1.5 ${guest ? "self-start" : "self-end"}`}>
                <div
                  title={`${m.roleLabel} · ${formatDate(m.createdAt)}`}
                  className={`flex flex-col gap-2 whitespace-pre-wrap break-words rounded-2xl px-3 py-2 ${guest ? "bg-line" : m.isStaff ? "bg-brand text-white" : "bg-brand-soft"}`}
                >
                  {m.content}
                  {m.payment && <PayButton payment={m.payment} readOnly />}
                  {m.images.length > 0 && (
                    <ul className={`grid gap-1.5 ${m.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                      {m.images.map((src, i) => (
                        <li key={src}>
                          <a href={src} target="_blank" rel="noopener noreferrer" aria-label={CHAT_TEXT.openPhoto(i + 1)}>
                            <Photo src={src} alt={CHAT_TEXT.photoAlt(i + 1)} sizes="180px" className="relative aspect-[4/3] overflow-hidden rounded-lg" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {selected && (
          <form onSubmit={send} className="border-t border-line p-3">
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
