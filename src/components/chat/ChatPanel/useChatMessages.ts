import { useState } from "react";
import { sendMessage } from "@/lib/api";
import { errorMessage } from "@/utils/auth-errors";

/** The messages the user has sent in this panel, and sending a new one. */
export function useChatMessages() {
  const [messages, setMessages] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  /** Resolves to true when the message was saved, so the composer knows to clear itself. */
  async function send(text: string) {
    setSending(true);
    setError("");
    try {
      await sendMessage(text);
      setMessages((current) => [...current, text]);
      return true;
    } catch (e) {
      setError(errorMessage(e));
      return false;
    } finally {
      setSending(false);
    }
  }

  return { messages, sending, error, send };
}
