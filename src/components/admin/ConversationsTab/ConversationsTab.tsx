"use client";

import { useEffect, useState } from "react";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { ADMIN_TEXT, CONVERSATIONS_TEXT } from "@/content/admin";
import { getMessages, listConversations, type AdminConversation, type AdminMessage } from "@/lib/admin-api";
import { errorMessage } from "@/utils/auth-errors";

const formatDate = (iso: string | null) => (iso ? new Date(iso).toLocaleString() : ADMIN_TEXT.noDate);

type Thread = { id: string; messages?: AdminMessage[]; error?: string };

export function ConversationsTab() {
  const [conversations, setConversations] = useState<AdminConversation[]>();
  const [listError, setListError] = useState("");
  const [selected, setSelected] = useState<string>();
  const [thread, setThread] = useState<Thread>();

  useEffect(() => {
    listConversations().then(setConversations, (e) => setListError(errorMessage(e)));
  }, []);

  useEffect(() => {
    if (!selected) return;
    // Ignore a slow answer for a conversation that is no longer the selected one.
    let active = true;
    getMessages(selected).then(
      (messages) => active && setThread({ id: selected, messages }),
      (e) => active && setThread({ id: selected, error: errorMessage(e) }),
    );
    return () => {
      active = false;
    };
  }, [selected]);

  if (listError) return <ErrorAlert message={listError} />;
  if (!conversations) return <p className="text-muted">{ADMIN_TEXT.loading}</p>;
  if (conversations.length === 0) return <p className="text-muted">{CONVERSATIONS_TEXT.empty}</p>;

  const current = thread?.id === selected ? thread : undefined;
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
              <span className="block font-semibold">{c.name}</span>
              <span className="block text-sm text-muted">
                {CONVERSATIONS_TEXT.messages(c.messageCount)} · {CONVERSATIONS_TEXT.lastActivity}{" "}
                {formatDate(c.updatedAt)}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <section>
        {!selected && <p className="text-muted">{CONVERSATIONS_TEXT.choose}</p>}
        {selected && !current && <p className="text-muted">{ADMIN_TEXT.loading}</p>}
        {current?.error && <ErrorAlert message={current.error} />}
        {current?.messages?.length === 0 && <p className="text-muted">{CONVERSATIONS_TEXT.emptyThread}</p>}
        {current?.messages && current.messages.length > 0 && (
          <ol className="flex flex-col gap-3">
            {current.messages.map((m) => (
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
