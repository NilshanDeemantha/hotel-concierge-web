"use client";

import Link from "next/link";
import { useChat } from "@/components/chat/ChatContext";
import { Icon } from "@/components/ui/Icon";
import { ROUTES } from "@/constants";
import type { ChatCtaProps } from "./ChatCta.types";

const chatIcon = (
  <Icon>
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
  </Icon>
);

/** A button that opens the chat, or leads to the login page when signed out. */
export function ChatCta({ className, children }: ChatCtaProps) {
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
    <Link href={ROUTES.login} className={className}>
      {chatIcon}
      {children}
    </Link>
  );
}
