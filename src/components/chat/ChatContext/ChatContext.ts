"use client";

import { createContext, useContext } from "react";
import type { ChatState } from "./ChatContext.types";

export const ChatContext = createContext<ChatState | null>(null);

export function useChat() {
  const state = useContext(ChatContext);
  if (!state) throw new Error("useChat must be used inside ChatProvider");
  return state;
}
