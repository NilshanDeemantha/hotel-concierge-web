import { idToken, post } from "@/lib/api";

// Reads come straight from Firestore (src/hooks/admin); only the writes go through the server.
export type AdminConversation = { id: string; uid: string; messageCount: number; updatedAt: Date | null };
export type AdminMessage = { id: string; role: string; content: string; createdAt: Date | null };

async function adminPost<T>(path: string, body: unknown = {}) {
  return post<T>(path, body, await idToken());
}

export const sendStaffMessage = async (conversationId: string, text: string) => {
  await adminPost("admin_send_message", { conversationId, text });
};
