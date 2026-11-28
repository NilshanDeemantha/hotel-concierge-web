"use client";

import { useState } from "react";
import { LoadError } from "@/components/admin/LoadError";
import { ADMIN_TEXT, BOOKINGS_TEXT } from "@/content/admin";
import { useBookings } from "@/hooks/admin/useAdminData";
import type { BookingData } from "@/models/Booking";

const STATUS_STYLE: Record<string, string> = {
  confirmed: "bg-brand-soft text-brand",
  payment_pending: "bg-line text-ink",
  cancelled: "bg-line text-muted",
};
const when = (d: Date | null) => (d ? d.toLocaleString() : ADMIN_TEXT.noDate);

/** The line under a booking that depends on its status: what the guest owes, paid, or what was refunded. */
function statusNote(b: BookingData) {
  if (b.status === "payment_pending") return BOOKINGS_TEXT.payUntil(when(b.paymentDeadline));
  if (b.status === "confirmed") return BOOKINGS_TEXT.paidOn(when(b.paidAt));
  const reason = BOOKINGS_TEXT.reasons[b.cancelReason] ?? "";
  if (b.refundStatus === "failed") return `${reason} · ${BOOKINGS_TEXT.refundFailed}`;
  if (b.refundStatus === "done") return `${reason} · ${BOOKINGS_TEXT.refund(BOOKINGS_TEXT.total(b.refundLKR), b.refundPercent)}`;
  return reason;
}

export function BookingsTab() {
  const list = useBookings();
  const [filter, setFilter] = useState("all");

  if (list.error) return <LoadError message={list.error} onRetry={list.retry} />;
  if (!list.data) return <p className="text-muted">{ADMIN_TEXT.loading}</p>;
  if (list.data.length === 0) return <p className="text-muted">{BOOKINGS_TEXT.empty}</p>;
  const shown = list.data.filter((b) => filter === "all" || b.data.status === filter);

  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label={BOOKINGS_TEXT.filterLabel} className="flex flex-wrap gap-2">
        {["all", ...Object.keys(BOOKINGS_TEXT.statuses)].map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            className={`min-h-11 rounded-full border border-line px-4 font-semibold ${filter === key ? "bg-brand-soft text-brand" : "text-muted"}`}
            onClick={() => setFilter(key)}
          >
            {key === "all" ? BOOKINGS_TEXT.all : BOOKINGS_TEXT.statuses[key]}
          </button>
        ))}
      </div>
      {shown.length === 0 && <p className="text-muted">{BOOKINGS_TEXT.emptyFilter}</p>}
      <ul className="grid gap-3 @3xl:grid-cols-2">
        {shown.map(({ data: b }) => (
          <li key={b.id} className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold">{b.reference}</p>
                <p className="truncate text-sm text-muted">{b.guestName}</p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${STATUS_STYLE[b.status] ?? "bg-line text-muted"}`}>
                {BOOKINGS_TEXT.statuses[b.status] ?? b.status}
              </span>
            </div>
            <p>{BOOKINGS_TEXT.room(b.roomNumber, b.roomName || b.roomType)}</p>
            <p className="text-sm">{BOOKINGS_TEXT.stay(b.checkIn, b.checkOut, b.nights)}</p>
            <p className="font-semibold">{BOOKINGS_TEXT.total(b.totalLKR)}</p>
            <p className="text-sm text-muted">{statusNote(b)}</p>
            <p className="text-xs text-muted">{BOOKINGS_TEXT.booked(when(b.createdAt))}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
