import type { User } from "firebase/auth";

export type ChatPanelProps = { user: User; onClose: () => void };
export type ChatPanelHeaderProps = { onClose: () => void };
/** `images` are photos Xenia sent with the answer (room photos from our own Storage bucket). */
/** A one-time payment link Xenia sent for a booking; `expiresAt` is an ISO time. */
export type ChatPayment = { url: string; expiresAt: string };
export type ChatMessage = { role: "user" | "assistant"; text: string; images: string[]; payment?: ChatPayment };
export type ChatPanelMessagesProps = { firstName?: string; messages: ChatMessage[]; typing: boolean };
export type ChatPanelComposerProps = { sending: boolean; onSend: (text: string) => Promise<boolean> };
