import { idToken, post } from "@/lib/api";

export type AdminRoom = { id: string; number: string; type: string; active: boolean };
export type AdminConversation = { id: string; uid: string; name: string; messageCount: number; updatedAt: string };
export type AdminMessage = { id: string; role: string; content: string; createdAt: string | null };
export type DayEntry = { status: "booked" | "blocked"; note?: string };
/** days is keyed by room id, then by two-digit day of the month. */
export type AvailabilityMonth = { month: string; days: Record<string, Record<string, DayEntry>> };

async function adminPost<T>(path: string, body: unknown = {}) {
  return post<T>(path, body, await idToken());
}

export const listConversations = async () =>
  (await adminPost<{ conversations: AdminConversation[] }>("admin_list_conversations")).conversations;

export const getMessages = async (conversationId: string) =>
  (await adminPost<{ messages: AdminMessage[] }>("admin_get_messages", { conversationId })).messages;

export const listRooms = async () => (await adminPost<{ rooms: AdminRoom[] }>("admin_list_rooms")).rooms;

export const saveRoom = async (room: { id?: string; number: string; type: string; active: boolean }) =>
  (await adminPost<{ room: AdminRoom }>("admin_save_room", room)).room;

export const getAvailability = (month: string) => adminPost<AvailabilityMonth>("admin_get_availability", { month });

export async function setAvailability(change: {
  roomId: string;
  from: string;
  to: string;
  status: "booked" | "blocked" | "free";
  note?: string;
}) {
  await adminPost("admin_set_availability", change);
}
