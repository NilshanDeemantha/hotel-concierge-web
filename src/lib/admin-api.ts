import { idToken, post } from "@/lib/api";

// Reads come straight from Firestore (src/hooks/admin); only the writes go through the server.
export type AdminRoom = { id: string; number: string; type: string; active: boolean };
export type AdminConversation = { id: string; uid: string; messageCount: number; updatedAt: Date | null };
export type AdminMessage = { id: string; role: string; content: string; createdAt: Date | null };
export type DayEntry = { status: "booked" | "blocked"; note?: string };
/** Keyed by room id, then by two-digit day of the month. */
export type AvailabilityDays = Record<string, Record<string, DayEntry>>;

async function adminPost<T>(path: string, body: unknown = {}) {
  return post<T>(path, body, await idToken());
}

export const saveRoom = async (room: { id?: string; number: string; type: string; active: boolean }) =>
  (await adminPost<{ room: AdminRoom }>("admin_save_room", room)).room;

export async function setAvailability(change: {
  roomId: string;
  from: string;
  to: string;
  status: "booked" | "blocked" | "free";
  note?: string;
}) {
  await adminPost("admin_set_availability", change);
}
