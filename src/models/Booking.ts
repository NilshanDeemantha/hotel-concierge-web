import { type QueryDocumentSnapshot } from "firebase/firestore";
import { MODEL_CONFIG } from "./config";
import { Model } from "./Model";

export type BookingData = {
  id: string;
  reference: string;
  status: string;
  uid: string;
  guestName: string;
  roomNumber: string;
  roomName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalLKR: number;
  paymentDeadline: Date | null;
  paidAt: Date | null;
  cancelReason: string;
  refundStatus: string;
  refundLKR: number;
  refundPercent: number;
  createdAt: Date | null;
};

/** One booking made by Xenia. The server writes it; staff can only read it. */
export class Booking extends Model<BookingData> {
  static collection = "bookings";
  static limit: number = MODEL_CONFIG.limits.bookings;

  readonly data: BookingData;

  constructor(data: BookingData) {
    super(data);
    this.data = data;
  }

  static fromSnapshot(d: QueryDocumentSnapshot) {
    const s = (k: string) => (typeof d.get(k) === "string" ? (d.get(k) as string) : "");
    const n = (k: string) => (typeof d.get(k) === "number" ? (d.get(k) as number) : 0);
    return new Booking({
      id: d.id, reference: s("reference"), status: s("status"), uid: s("uid"), guestName: s("guestName"),
      roomNumber: s("roomNumber"), roomName: s("roomName"), roomType: s("roomType"),
      checkIn: s("checkIn"), checkOut: s("checkOut"), nights: n("nights"), totalLKR: n("totalLKR"),
      paymentDeadline: Model.toDate(d.get("paymentDeadline")), paidAt: Model.toDate(d.get("paidAt")),
      cancelReason: s("cancelReason"), refundStatus: s("refundStatus"), refundLKR: n("refundLKR"), refundPercent: n("refundPercent"),
      createdAt: Model.toDate(d.get("createdAt")),
    });
  }

  /** Awaiting payment first, then by check-in date, the soonest first; cancelled ones last. */
  static soonestFirst(a: Booking, b: Booking) {
    const rank = (x: Booking) => (x.data.status === "payment_pending" ? 0 : x.data.status === "cancelled" ? 2 : 1);
    return rank(a) - rank(b) || a.data.checkIn.localeCompare(b.data.checkIn);
  }

  toData(): BookingData {
    return this.data;
  }
}
