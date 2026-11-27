"use client";

import { useEffect, useState } from "react";
import { CHAT_TEXT } from "@/content/chat";
import type { ChatPayment } from "@/components/chat/ChatPanel/ChatPanel.types";

const badge = "inline-flex min-h-11 items-center justify-center rounded-full px-4 font-semibold";

/**
 * The payment part of a payment message: a "Pay now" button while the link is open, "Payment done" once the server
 * says it was paid, and "Payment link expired" after the expiry time (or when the booking was cancelled unpaid).
 * `readOnly` is for staff: the same state as a badge, never a link.
 */
export function PayButton({ payment, readOnly = false }: { payment: ChatPayment; readOnly?: boolean }) {
  const expiresAt = Date.parse(payment.expiresAt);
  const [late, setLate] = useState(() => Date.now() >= expiresAt);
  useEffect(() => {
    const wait = expiresAt - Date.now();
    if (wait <= 0) return;
    const timer = setTimeout(() => setLate(true), Math.min(wait, 2 ** 31 - 1));
    return () => clearTimeout(timer);
  }, [expiresAt]);

  const time = new Date(expiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (payment.status === "paid") {
    return <span className={`${badge} bg-brand-soft text-brand`}>✓ {CHAT_TEXT.payDone}</span>;
  }
  const expired = late || payment.status === "closed";
  return (
    <div className="flex flex-col gap-1.5 text-[13px] text-muted">
      {expired ? (
        <span className={`${badge} bg-line`}>{CHAT_TEXT.payExpired}</span>
      ) : readOnly ? (
        <span className={`${badge} bg-line`}>{CHAT_TEXT.payWaiting(time)}</span>
      ) : (
        <a
          href={payment.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand px-4 text-[15px] font-semibold text-white"
        >
          {CHAT_TEXT.payNow}
        </a>
      )}
      {!readOnly && <span>{expired ? CHAT_TEXT.payNote : `${CHAT_TEXT.payExpires(time)}. ${CHAT_TEXT.payNote}.`}</span>}
    </div>
  );
}
