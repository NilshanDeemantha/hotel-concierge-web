"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import Link from "next/link";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth } from "@/lib/firebase";

type ChatState = {
  // undefined = still checking, null = signed out
  user: User | null | undefined;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const ChatContext = createContext<ChatState | null>(null);
const STORAGE_KEY = "chat-panel";

function useChat() {
  const state = useContext(ChatContext);
  if (!state) throw new Error("useChat must be used inside ChatProvider");
  return state;
}

// sessionStorage can throw in private windows; the panel works without it.
function remember(value: "open" | "closed" | null) {
  try {
    if (value) sessionStorage.setItem(STORAGE_KEY, value);
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
}

function wasClosed() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "closed";
  } catch {
    return false;
  }
}

const chatIcon = (
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
  </svg>
);

/** Holds the login and chat-panel state, and lays out the page beside the panel. */
export function ChatProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [open, setOpenState] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(auth, (next) => {
        setUser(next);
        if (!next) remember(null);
        // The chat opens after login, unless the visitor closed it earlier in this tab.
        setOpenState(Boolean(next) && !wasClosed());
      }),
    [],
  );

  function setOpen(next: boolean) {
    setOpenState(next);
    remember(next ? "open" : "closed");
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

  return (
    <ChatContext.Provider value={{ user, open, setOpen }}>
      {/* On desktop the page moves over so the sidebar never covers it. The inner box is a
          container, so the page lays itself out for the width that is left. */}
      <div className={showPanel ? "lg:mr-[380px]" : undefined}>
        <div className="@container mx-auto flex min-h-dvh w-full max-w-[1200px] flex-col">{children}</div>
      </div>
      {showPanel && user ? <ChatPanel user={user} onClose={() => setOpen(false)} /> : <ChatLauncher />}
    </ChatContext.Provider>
  );
}

/** A button that opens the chat, or leads to the login page when signed out. */
export function ChatCta({ className, children }: { className?: string; children: ReactNode }) {
  const { user, setOpen } = useChat();
  if (user) {
    return (
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {chatIcon}
        {children}
      </button>
    );
  }
  return (
    <Link href="/login" className={className}>
      {chatIcon}
      {children}
    </Link>
  );
}

function ChatLauncher() {
  const { user } = useChat();
  // Nothing while the login state is still loading, so the button never changes meaning mid-click.
  if (user === undefined) return null;
  return (
    <ChatCta className="fixed right-5 bottom-5 z-40 flex size-15 items-center justify-center rounded-full bg-brand text-white shadow-[0_10px_28px_rgba(30,42,40,0.3)] [&>svg]:size-7">
      <span className="sr-only">{user ? "Open chat with Xenia" : "Log in to chat with Xenia"}</span>
    </ChatCta>
  );
}

function ChatPanel({ user, onClose }: { user: User; onClose: () => void }) {
  const firstName = user.displayName?.split(" ")[0];
  return (
    <aside
      aria-label="Chat with Xenia, the AI concierge"
      className="fixed inset-0 z-50 flex flex-col bg-bg lg:left-auto lg:w-[380px] lg:border-l lg:border-line"
    >
      <div className="flex items-center gap-3 bg-brand py-3 pr-2 pl-2 text-white lg:pl-4">
        <button
          type="button"
          aria-label="Back to the site"
          className="flex size-11 flex-none items-center justify-center rounded-full lg:hidden"
          onClick={onClose}
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
        </button>
        <div aria-hidden="true" className="flex size-10 flex-none items-center justify-center rounded-full bg-white font-serif text-xl font-semibold text-brand">
          X
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-lg leading-tight font-semibold">Xenia</h2>
          <p className="text-[12.5px]">Thambili Bay&apos;s AI concierge</p>
        </div>
        <button
          type="button"
          aria-label="Close chat"
          className="hidden size-11 flex-none items-center justify-center rounded-full lg:flex"
          onClick={onClose}
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div aria-live="polite" className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-4">
        <p className="self-center rounded-full bg-brand-soft px-3 py-1.5 text-center text-[12.5px] text-muted">
          Demo: please don&apos;t enter real personal details.
        </p>
        <p className="max-w-[85%] self-start rounded-2xl rounded-bl-sm border border-line bg-surface px-3.5 py-2.5 text-[15px]">
          Hello{firstName ? ` ${firstName}` : ""}! I&apos;m Xenia, the concierge at Thambili Bay. Soon I&apos;ll be
          able to check rooms, make a booking and help during your stay, right here.
        </p>
      </div>

      <div className="border-t border-line bg-surface px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]">
        <form className="flex items-center gap-2" onSubmit={(event) => event.preventDefault()}>
          <input
            type="text"
            aria-label="Type your message"
            placeholder="Messages open soon"
            disabled
            className="h-11 min-w-0 flex-1 rounded-full border border-line bg-bg px-4 text-base text-ink placeholder:text-muted disabled:opacity-70"
          />
          <button
            type="submit"
            aria-label="Send"
            disabled
            className="flex size-11 flex-none items-center justify-center rounded-full bg-brand text-white disabled:opacity-50"
          >
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>
        <p className="mt-1.5 text-center text-[11.5px] text-muted">
          Xenia is an AI and can make mistakes. Demo data only.
        </p>
      </div>
    </aside>
  );
}
