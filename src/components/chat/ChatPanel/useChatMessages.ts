import type { User } from "firebase/auth";
import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { sendMessage } from "@/lib/api";
import { db } from "@/lib/firebase";
import { errorMessage } from "@/utils/auth-errors";
import type { ChatMessage } from "./ChatPanel.types";

const HISTORY_LIMIT = 50;

/**
 * The conversation, live: saved messages, Xenia's answers and whether she is typing all arrive
 * from Firestore as the server writes them. Sending only posts the text to the server.
 */
export function useChatMessages(user: User) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // The rules allow reads only for the user's own documents, so every query names the user.
    const onError = (e: unknown) => setError(errorMessage(e));
    const stopMessages = onSnapshot(
      query(collection(db, "messages"), where("uid", "==", user.uid), orderBy("createdAt", "desc"), limit(HISTORY_LIMIT)),
      (snapshot) =>
        setMessages(
          snapshot.docs
            .map((d) => ({ role: d.get("role") as ChatMessage["role"], text: d.get("content") as string }))
            .reverse(),
        ),
      onError,
    );
    // The server sets `typing` on the conversation while Xenia is working on an answer.
    const stopConversation = onSnapshot(
      query(collection(db, "conversations"), where("uid", "==", user.uid), limit(1)),
      (snapshot) => setTyping(Boolean(snapshot.docs[0]?.get("typing"))),
      onError,
    );
    return () => {
      stopMessages();
      stopConversation();
    };
  }, [user.uid]);

  /** Resolves to true when the message was saved, so the composer knows to clear itself. */
  async function send(text: string) {
    setSending(true);
    setError("");
    try {
      await sendMessage(text);
      return true;
    } catch (e) {
      setError(errorMessage(e));
      return false;
    } finally {
      setSending(false);
    }
  }

  return { messages, typing, sending, error, send };
}
