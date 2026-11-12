import { CHAT_TEXT } from "@/content/chat";
import type { ChatPanelMessagesProps } from "./ChatPanel.types";

export function ChatPanelMessages({ firstName }: ChatPanelMessagesProps) {
  return (
    <div aria-live="polite" className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-4">
      <p className="self-center rounded-full bg-brand-soft px-3 py-1.5 text-center text-[12.5px] text-muted">
        {CHAT_TEXT.demoNote}
      </p>
      <p className="max-w-[85%] self-start rounded-2xl rounded-bl-sm border border-line bg-surface px-3.5 py-2.5 text-[15px]">
        {CHAT_TEXT.greetingStart}
        {firstName ? ` ${firstName}` : ""}
        {CHAT_TEXT.greetingBody}
      </p>
    </div>
  );
}
