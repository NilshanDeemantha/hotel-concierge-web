"use client";

import { ChatContext } from "@/components/chat/ChatContext";
import { ChatLauncher } from "@/components/chat/ChatLauncher";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import type { ChatProviderProps } from "./ChatProvider.types";
import { useChatPanelState } from "./useChatPanelState";

/** Holds the login and chat-panel state, and lays out the page beside the panel. */
export function ChatProvider({ children }: ChatProviderProps) {
  const { user, open, setOpen, showPanel: panelOpen } = useChatPanelState();
  const isAdmin = useIsAdmin();
  // Staff have no use for Xenia: no button or panel for an admin, nor while a signed-in account is still being checked.
  const chatAllowed = isAdmin === false;
  const showPanel = panelOpen && chatAllowed;

  return (
    <ChatContext.Provider value={{ user, open, setOpen }}>
      {/* On desktop the page moves over so the sidebar never covers it. The inner box is a
          container, so the page lays itself out for the width that is left. */}
      <div className={showPanel ? "lg:mr-[380px]" : undefined}>
        <div className="@container mx-auto flex min-h-dvh w-full max-w-[1200px] flex-col">{children}</div>
      </div>
      {chatAllowed && (showPanel && user ? <ChatPanel user={user} onClose={() => setOpen(false)} /> : <ChatLauncher />)}
    </ChatContext.Provider>
  );
}
