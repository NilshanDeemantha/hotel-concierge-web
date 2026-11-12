import type { User } from "firebase/auth";

export type ChatPanelProps = { user: User; onClose: () => void };
export type ChatPanelHeaderProps = { onClose: () => void };
export type ChatPanelMessagesProps = { firstName?: string };
