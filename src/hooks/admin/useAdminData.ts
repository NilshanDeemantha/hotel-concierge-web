import { doc, getDoc, type QuerySnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { CONVERSATIONS_TEXT } from "@/content/admin";
import { db } from "@/lib/firebase";
import { Availability } from "@/models/Availability";
import { Booking } from "@/models/Booking";
import { Conversation } from "@/models/Conversation";
import { Message } from "@/models/Message";
import { Room } from "@/models/Room";
import { useLiveQuery } from "./useLiveQuery";

// The admin screens read Firestore directly (the rules allow admins); writes go through the server.
// What each collection looks like, and how it is queried, lives in its model (src/models).
const conversationsQuery = () => Conversation.recentQuery();
const toConversations = (s: QuerySnapshot) => s.docs.map((d) => Conversation.fromSnapshot(d));
export const useConversations = () => useLiveQuery("all", conversationsQuery, toConversations);

const messagesQuery = (conversationId: string) => Message.ofConversationQuery(conversationId);
const toMessages = (s: QuerySnapshot) => s.docs.map((d) => Message.fromSnapshot(d)).sort(Message.oldestFirst);
export const useMessages = (conversationId: string | undefined) =>
  useLiveQuery(conversationId ?? null, messagesQuery, toMessages);

const roomsQuery = () => Room.listQuery();
const toRooms = (s: QuerySnapshot) => s.docs.map((d) => Room.fromSnapshot(d)).sort(Room.byNumber);
export const useRooms = () => useLiveQuery("all", roomsQuery, toRooms);

const availabilityQuery = (roomId: string) => Availability.ofRoomQuery(roomId);
const toAvailability = (s: QuerySnapshot) => s.docs.map((d) => Availability.fromSnapshot(d));
export const useAvailability = (roomId: string) => useLiveQuery(roomId, availabilityQuery, toAvailability);

/**
 * Guest names by uid, fetched once per uid for as long as the screen is open.
 * Reads only `name` from the profile; nothing else of it is kept.
 */
export function useGuestNames(uids: string[]) {
  const [names, setNames] = useState<Record<string, string>>({});
  const requested = useRef(new Set<string>());
  const key = [...new Set(uids)].sort().join(",");

  useEffect(() => {
    const missing = key.split(",").filter((uid) => uid && !requested.current.has(uid));
    if (missing.length === 0) return;
    missing.forEach((uid) => requested.current.add(uid));
    Promise.all(
      missing.map((uid) =>
        getDoc(doc(db, "users", uid)).then(
          (snapshot) => snapshot.get("name"),
          () => undefined,
        ),
      ),
    ).then((found) =>
      setNames((prev) => {
        const next = { ...prev };
        missing.forEach((uid, i) => {
          const name = found[i];
          next[uid] = typeof name === "string" && name.trim() ? name : CONVERSATIONS_TEXT.unknownGuest;
        });
        return next;
      }),
    );
  }, [key]);

  return names;
}

const bookingsQuery = () => Booking.listQuery();
const toBookings = (s: QuerySnapshot) => s.docs.map((d) => Booking.fromSnapshot(d)).sort(Booking.soonestFirst);
export const useBookings = () => useLiveQuery("all", bookingsQuery, toBookings);
