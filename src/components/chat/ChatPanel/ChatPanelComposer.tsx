import { Icon } from "@/components/ui/Icon";
import { CHAT_TEXT } from "@/content/chat";

export function ChatPanelComposer() {
  return (
    <div className="border-t border-line bg-surface px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]">
      <form className="flex items-center gap-2" onSubmit={(event) => event.preventDefault()}>
        <input
          type="text"
          aria-label={CHAT_TEXT.messageLabel}
          placeholder={CHAT_TEXT.messagePlaceholder}
          disabled
          className="h-11 min-w-0 flex-1 rounded-full border border-line bg-bg px-4 text-base text-ink placeholder:text-muted disabled:opacity-70"
        />
        <button
          type="submit"
          aria-label={CHAT_TEXT.send}
          disabled
          className="flex size-11 flex-none items-center justify-center rounded-full bg-brand text-white disabled:opacity-50"
        >
          <Icon>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </Icon>
        </button>
      </form>
      <p className="mt-1.5 text-center text-[11.5px] text-muted">{CHAT_TEXT.disclaimer}</p>
    </div>
  );
}
