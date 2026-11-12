import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { rememberChatState, wasChatClosed } from "@/utils/chat-storage";

/** Login state plus whether the chat panel is open (and remembered for this tab). */
export function useChatPanelState() {
  // undefined = still checking, null = signed out
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [open, setOpenState] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(auth, (next) => {
        setUser(next);
        if (!next) rememberChatState(null);
        // The chat opens after login, unless the visitor closed it earlier in this tab.
        setOpenState(Boolean(next) && !wasChatClosed());
      }),
    [],
  );

  function setOpen(next: boolean) {
    setOpenState(next);
    rememberChatState(next ? "open" : "closed");
  }

  const showPanel = Boolean(user) && open;

  useEffect(() => {
    if (!showPanel) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showPanel]);

  return { user, open, setOpen, showPanel };
}
