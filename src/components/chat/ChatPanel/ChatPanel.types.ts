import type { User } from "firebase/auth";

export type ChatPanelProps = { user: User; onClose: () => void };
export type ChatPanelHeaderProps = { onClose: () => void };
/** `images` are photos Xenia sent with the answer (room photos from our own Storage bucket). */
export type ChatMessage = { role: "user" | "assistant"; text: string; images: string[] };
export type ChatPanelMessagesProps = { firstName?: string; messages: ChatMessage[]; typing: boolean };
export type ChatPanelComposerProps = { sending: boolean; onSend: (text: string) => Promise<boolean> };
