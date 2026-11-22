import { CHAT_STORAGE_KEY } from "@/constants";

// sessionStorage can throw in private windows; the panel works without it.
export function rememberChatState(value: "open" | "closed" | null) {
  try {
    if (value) sessionStorage.setItem(CHAT_STORAGE_KEY, value);
    else sessionStorage.removeItem(CHAT_STORAGE_KEY);
  } catch {}
}

export function wasChatClosed() {
  try {
    return sessionStorage.getItem(CHAT_STORAGE_KEY) === "closed";
  } catch {
    return false;
  }
}
