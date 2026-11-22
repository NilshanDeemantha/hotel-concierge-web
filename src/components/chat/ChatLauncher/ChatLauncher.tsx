"use client";

import { useChat } from "@/components/chat/ChatContext";
import { ChatCta } from "@/components/chat/ChatCta";
import { CHAT_TEXT } from "@/content/chat";
import { launcherClass } from "./ChatLauncher.styles";

export function ChatLauncher() {
  const { user } = useChat();
  // Nothing while the login state is still loading, so the button never changes meaning mid-click.
  if (user === undefined) return null;
  return (
    <ChatCta className={launcherClass}>
      <span className="sr-only">{user ? CHAT_TEXT.openChat : CHAT_TEXT.loginToChat}</span>
    </ChatCta>
  );
}
