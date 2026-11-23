"use client";

import { useState } from "react";
import { LoadError } from "@/components/admin/LoadError";
import { ADMIN_TEXT, CONVERSATIONS_TEXT } from "@/content/admin";
import { useConversations, useGuestNames, useMessages } from "@/hooks/admin/useAdminData";

const formatDate = (date: Date | null) => (date ? date.toLocaleString() : ADMIN_TEXT.noDate);

export function ConversationsTab() {
  const list = useConversations();
  const [selected, setSelected] = useState<string>();
  const thread = useMessages(selected);
  const names = useGuestNames(list.data?.map((c) => c.uid) ?? []);
  const conversations = list.data;

  if (list.error) return <LoadError message={list.error} onRetry={list.retry} />;
  if (!conversations) return <p className="text-muted">{ADMIN_TEXT.loading}</p>;
  if (conversations.length === 0) return <p className="text-muted">{CONVERSATIONS_TEXT.empty}</p>;

  return (
    <div className="grid gap-6 @4xl:grid-cols-[320px_1fr]">
      <ul aria-label={CONVERSATIONS_TEXT.listLabel} className="flex flex-col gap-2">
        {conversations.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              aria-pressed={c.id === selected}
              className={`w-full rounded-xl border p-3 text-left ${
                c.id === selected ? "border-brand bg-brand-soft" : "border-line bg-surface"
              }`}
              onClick={() => setSelected(c.id)}
            >
              <span className="block font-semibold">{names[c.uid] ?? ADMIN_TEXT.loading}</span>
              <span className="block text-sm text-muted">
                {CONVERSATIONS_TEXT.messages(c.messageCount)} · {CONVERSATIONS_TEXT.lastActivity}{" "}
                {formatDate(c.updatedAt)}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <section className="flex flex-col gap-3">
        {!selected && <p className="text-muted">{CONVERSATIONS_TEXT.choose}</p>}
        {thread.loading && <p className="text-muted">{ADMIN_TEXT.loading}</p>}
        <LoadError message={thread.error} onRetry={thread.retry} />
        {thread.data?.length === 0 && <p className="text-muted">{CONVERSATIONS_TEXT.emptyThread}</p>}
        {thread.data && thread.data.length > 0 && (
          <ol className="flex flex-col gap-3">
            {thread.data.map((m) => (
              <li key={m.id} className="rounded-xl border border-line bg-surface p-3">
                <p className="text-sm text-muted">
                  <span className="font-semibold text-ink">{CONVERSATIONS_TEXT.roles[m.role] ?? m.role}</span> ·{" "}
                  {formatDate(m.createdAt)}
                </p>
                <p className="mt-1 whitespace-pre-wrap">{m.content}</p>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
