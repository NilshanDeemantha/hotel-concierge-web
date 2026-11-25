import { doc, runTransaction, serverTimestamp, where, type QueryDocumentSnapshot } from "firebase/firestore";
import { AVAILABILITY_TEXT, MAX_AVAILABILITY_NOTE, MAX_NIGHTS } from "@/content/admin";
import { db } from "@/lib/firebase";
import { ServerError } from "@/utils/auth-errors";
import { MODEL_CONFIG } from "./config";
import { Model } from "./Model";

export type DayStatus = "booked" | "blocked";
export type DayEntry = { status: DayStatus; note?: string };
/** A date as "YYYY-MM-DD". */
export type DateKey = string;
export type AvailabilityData = { id: string; roomId: string; month: string; days: Record<string, DayEntry> };

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const utc = (date: DateKey) => new Date(`${date}T00:00:00Z`);

/**
 * One room's taken days in one month (`availability/<roomId>_<YYYY-MM>`). A day that is not listed is free.
 * Bookings made through Xenia are written by the server into the same documents. The web app changes
 * them in a transaction, so two staff members cannot both take the same night.
 */
export class Availability extends Model<AvailabilityData> {
  static collection = "availability";
  static limit: number = MODEL_CONFIG.limits.availability;
  static writable = true;

  readonly roomId: string;
  readonly month: string;
  readonly days: Record<string, DayEntry>;

  constructor(data: AvailabilityData) {
    super(data);
    this.roomId = data.roomId;
    this.month = data.month;
    this.days = data.days;
  }

  static fromSnapshot(d: QueryDocumentSnapshot) {
    return new Availability({ id: d.id, roomId: d.get("roomId"), month: d.get("month"), days: d.get("days") ?? {} });
  }

  toData(): AvailabilityData {
    const { id, roomId, month, days } = this;
    return { id, roomId, month, days };
  }

  static idFor(roomId: string, month: string) {
    return `${roomId}_${month}`;
  }

  /** Every month of one room. */
  static ofRoomQuery(roomId: string) {
    return this.listQuery(where("roomId", "==", roomId));
  }

  /** The taken days of all the months, by date. */
  static takenDays(months: Availability[]) {
    const taken = new Map<DateKey, DayEntry>();
    for (const m of months) for (const [day, entry] of Object.entries(m.days)) taken.set(`${m.month}-${day}`, entry);
    return taken;
  }

  /** Today and other local dates as "YYYY-MM-DD". */
  static dateKey(d: Date): DateKey {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  static addDays(date: DateKey, n: number): DateKey {
    const d = utc(date);
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }

  /** The nights from `from` up to, not including, `until`. Empty when the dates are not a valid range. */
  static nights(from: DateKey, until: DateKey): DateKey[] {
    if (!DATE.test(from) || !DATE.test(until)) return [];
    const count = Math.round((utc(until).getTime() - utc(from).getTime()) / 86_400_000);
    return count > 0 ? Array.from({ length: Math.min(count, MAX_NIGHTS + 1) }, (_, i) => Availability.addDays(from, i)) : [];
  }

  /** Why this change cannot be made, or "". */
  static rangeProblem(from: DateKey, until: DateKey, note: string) {
    if (!DATE.test(from) || !DATE.test(until)) return AVAILABILITY_TEXT.badDates;
    const nights = Availability.nights(from, until);
    if (nights.length === 0) return AVAILABILITY_TEXT.badRange;
    if (nights.length > MAX_NIGHTS) return AVAILABILITY_TEXT.tooLong;
    if (note.trim().length > MAX_AVAILABILITY_NOTE) return AVAILABILITY_TEXT.badNote;
    return "";
  }

  /** Which of these nights are already booked or removed. */
  static conflicts(taken: Map<DateKey, DayEntry>, nights: DateKey[]) {
    return nights.filter((n) => taken.has(n));
  }

  /**
   * Sets the nights to booked, blocked or free. All or nothing: a taken night stops the whole change
   * (ServerError), and the check runs inside the transaction, on the latest data.
   */
  static async apply(roomId: string, nights: DateKey[], status: DayStatus | "free", note: string) {
    const problem = nights.length === 0 || nights.length > MAX_NIGHTS || note.trim().length > MAX_AVAILABILITY_NOTE;
    if (problem) throw new ServerError(AVAILABILITY_TEXT.failed);
    const months = [...new Set(nights.map((n) => n.slice(0, 7)))];
    await runTransaction(db, async (tx) => {
      const refs = months.map((m) => doc(db, Availability.collection, Availability.idFor(roomId, m)));
      const snaps = await Promise.all(refs.map((r) => tx.get(r))); // every read before the first write
      snaps.forEach((snap, i) => {
        const days: Record<string, DayEntry> = { ...(snap.get("days") ?? {}) };
        for (const night of nights.filter((n) => n.startsWith(months[i]))) {
          const day = night.slice(8);
          if (status === "free") delete days[day];
          else if (days[day]) throw new ServerError(AVAILABILITY_TEXT.takenOn(night));
          else days[day] = note.trim() ? { status, note: note.trim() } : { status };
        }
        if (status === "free" && !snap.exists()) return; // nothing to free in a month that has no document
        tx.set(refs[i], {
          roomId, month: months[i], days,
          createdAt: snap.get("createdAt") ?? serverTimestamp(), updatedAt: serverTimestamp(),
        });
      });
    });
  }
}
