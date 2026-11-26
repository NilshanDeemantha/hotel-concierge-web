import { PayButton } from "@/components/chat/PayButton";
import { Photo } from "@/components/ui/Photo";
import { CHAT_TEXT } from "@/content/chat";
import type { ChatPanelMessagesProps } from "./ChatPanel.types";

export function ChatPanelMessages({ firstName, messages, typing }: ChatPanelMessagesProps) {
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
      {messages.map(({ role, text, images, payment }, index) => (
        <div
          key={index}
          className={
            role === "user"
              ? "max-w-[85%] self-end rounded-2xl rounded-br-sm bg-brand px-3.5 py-2.5 text-[15px] break-words whitespace-pre-wrap text-white"
              : "flex max-w-[85%] flex-col gap-2 self-start rounded-2xl rounded-bl-sm border border-line bg-surface px-3.5 py-2.5 text-[15px] break-words whitespace-pre-wrap"
          }
        >
          {text}
          {payment && <PayButton payment={payment} />}
          {images.length > 0 && (
            <ul className={`grid gap-1.5 ${images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
              {images.map((src, i) => (
                <li key={src}>
                  <a href={src} target="_blank" rel="noopener noreferrer" aria-label={CHAT_TEXT.openPhoto(i + 1)}>
                    <Photo src={src} alt={CHAT_TEXT.photoAlt(i + 1)} sizes="180px" className="relative aspect-[4/3] overflow-hidden rounded-lg" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      {typing && <p className="self-start px-1 text-[13px] text-muted">{CHAT_TEXT.typing}…</p>}
    </div>
  );
}
