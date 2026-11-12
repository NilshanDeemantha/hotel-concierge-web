import { Icon } from "@/components/ui/Icon";
import { CHAT_TEXT } from "@/content/chat";
import type { ChatPanelHeaderProps } from "./ChatPanel.types";

export function ChatPanelHeader({ onClose }: ChatPanelHeaderProps) {
  return (
    <div className="flex items-center gap-3 bg-brand py-3 pr-2 pl-2 text-white lg:pl-4">
      <button
        type="button"
        aria-label={CHAT_TEXT.backToSite}
        className="flex size-11 flex-none items-center justify-center rounded-full lg:hidden"
        onClick={onClose}
      >
        <Icon strokeWidth={2.2}>
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </Icon>
      </button>
      <div aria-hidden="true" className="flex size-10 flex-none items-center justify-center rounded-full bg-white font-serif text-xl font-semibold text-brand">
        X
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="font-serif text-lg leading-tight font-semibold">{CHAT_TEXT.agentName}</h2>
        <p className="text-[12.5px]">{CHAT_TEXT.agentSubtitle}</p>
      </div>
      <button
        type="button"
        aria-label={CHAT_TEXT.closeChat}
        className="hidden size-11 flex-none items-center justify-center rounded-full lg:flex"
        onClick={onClose}
      >
        <Icon roundJoin={false}>
          <path d="M6 6l12 12M18 6L6 18" />
        </Icon>
      </button>
    </div>
  );
}
