import type { User } from "firebase/auth";

export type ChatPanelProps = { user: User; onClose: () => void };
export type ChatPanelHeaderProps = { onClose: () => void };
export type ChatMessage = { role: "user" | "assistant"; text: string };
export type ChatPanelMessagesProps = { firstName?: string; messages: ChatMessage[]; typing: boolean };
export type ChatPanelComposerProps = { sending: boolean; error: string; onSend: (text: string) => Promise<boolean> };
