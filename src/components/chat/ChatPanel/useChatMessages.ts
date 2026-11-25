import type { User } from "firebase/auth";
import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { firebaseConfig } from "@/config/firebase";
import { sendMessage } from "@/lib/api";
import { db } from "@/lib/firebase";
import { errorMessage } from "@/utils/auth-errors";
import type { ChatMessage } from "./ChatPanel.types";

const HISTORY_LIMIT = 50;
// Only photos from our own Storage bucket are shown; any other link in a message is ignored.
const PHOTO_PREFIX = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/`;
const photosOf = (value: unknown) =>
  Array.isArray(value) ? value.filter((u): u is string => typeof u === "string" && u.startsWith(PHOTO_PREFIX)) : [];

/**
 * The conversation, live: saved messages, Xenia's answers and whether she is typing all arrive
 * from Firestore as the server writes them. Sending only posts the text to the server.
 */
export function useChatMessages(user: User) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // The rules allow reads only for the user's own documents, so every query names the user.
    const onError = (e: unknown) => toast.error(errorMessage(e));
    const stopMessages = onSnapshot(
      query(collection(db, "messages"), where("uid", "==", user.uid), orderBy("createdAt", "desc"), limit(HISTORY_LIMIT)),
      (snapshot) =>
        setMessages(
          snapshot.docs
            .map((d) => ({ role: d.get("role") as ChatMessage["role"], text: d.get("content") as string, images: photosOf(d.get("images")) }))
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
    try {
      await sendMessage(text);
      return true;
    } catch (e) {
      toast.error(errorMessage(e));
      return false;
    } finally {
      setSending(false);
    }
  }

  return { messages, typing, sending, send };
}
