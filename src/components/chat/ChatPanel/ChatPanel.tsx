"use client";

import { CHAT_TEXT } from "@/content/chat";
import { ChatPanelComposer } from "./ChatPanelComposer";
import { ChatPanelHeader } from "./ChatPanelHeader";
import { ChatPanelMessages } from "./ChatPanelMessages";
import type { ChatPanelProps } from "./ChatPanel.types";
import { useChatMessages } from "./useChatMessages";

export function ChatPanel({ user, onClose }: ChatPanelProps) {
  const firstName = user.displayName?.split(" ")[0];
  const { messages, typing, sending, error, send } = useChatMessages(user);
  return (
    <aside
      aria-label={CHAT_TEXT.panelLabel}
      className="fixed inset-0 z-50 flex flex-col bg-bg lg:left-auto lg:w-[380px] lg:border-l lg:border-line"
    >
      <ChatPanelHeader onClose={onClose} />
      <ChatPanelMessages firstName={firstName} messages={messages} typing={typing} />
      <ChatPanelComposer sending={sending} error={error} onSend={send} />
    </aside>
  );
}
