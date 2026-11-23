import {
  collection,
  doc,
  getDoc,
  limit,
  orderBy,
  query,
  Timestamp,
  where,
  type QuerySnapshot,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { CONVERSATIONS_TEXT } from "@/content/admin";
import { db } from "@/lib/firebase";
import type { AdminConversation, AdminMessage, AdminRoom, AvailabilityDays } from "@/lib/admin-api";
import { useLiveQuery } from "./useLiveQuery";

// The admin screens read Firestore directly (the rules allow admins); writes go through the server.
// A pending server timestamp reads as null until the server has set it.
const toDate = (value: unknown) => (value instanceof Timestamp ? value.toDate() : null);

// shortcut: the 100 most recent conversations only, add paging when a hotel has more.
const conversationsQuery = () =>
  query(collection(db, "conversations"), orderBy("updatedAt", "desc"), limit(100));
const toConversations = (s: QuerySnapshot): AdminConversation[] =>
  s.docs.map((d) => ({
    id: d.id,
    uid: d.get("uid"),
    messageCount: d.get("messageCount") ?? 0,
    updatedAt: toDate(d.get("updatedAt")),
  }));

export const useConversations = () => useLiveQuery("all", conversationsQuery, toConversations);

// shortcut: at most 500 messages per thread, unordered (no composite index), so a longer thread
// may miss some; add an index on (conversationId, createdAt) and orderBy when threads grow that long.
const messagesQuery = (conversationId: string) =>
  query(collection(db, "messages"), where("conversationId", "==", conversationId), limit(500));
const toMessages = (s: QuerySnapshot): AdminMessage[] =>
  s.docs
    .map((d) => ({ id: d.id, role: d.get("role"), content: d.get("content"), createdAt: toDate(d.get("createdAt")) }))
    // Oldest first; messages still waiting for their server timestamp go last.
    .sort((a, b) => (a.createdAt?.getTime() ?? Infinity) - (b.createdAt?.getTime() ?? Infinity));

export const useMessages = (conversationId: string | undefined) =>
  useLiveQuery(conversationId ?? null, messagesQuery, toMessages);

const roomsQuery = () => query(collection(db, "rooms"));
const toRooms = (s: QuerySnapshot): AdminRoom[] =>
  s.docs
    .map((d) => ({ id: d.id, number: d.get("number"), type: d.get("type"), active: d.get("active") === true }))
    .sort((a, b) => a.number.localeCompare(b.number, undefined, { numeric: true }));

export const useRooms = () => useLiveQuery("all", roomsQuery, toRooms);

const availabilityQuery = (month: string) => query(collection(db, "availability"), where("month", "==", month));
const toAvailability = (s: QuerySnapshot): AvailabilityDays =>
  Object.fromEntries(s.docs.map((d) => [d.get("roomId"), d.get("days") ?? {}]));

/** One month (YYYY-MM) of bookings and blocks, by room id then day. */
export const useAvailability = (month: string) => useLiveQuery(month, availabilityQuery, toAvailability);

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
