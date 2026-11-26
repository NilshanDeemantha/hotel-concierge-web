"use client";

import { useEffect, useState } from "react";
import { CHAT_TEXT } from "@/content/chat";
import type { ChatPayment } from "@/components/chat/ChatPanel/ChatPanel.types";

/** The "Pay now" button of a payment message. It stops being a link when the payment link expires. */
export function PayButton({ payment }: { payment: ChatPayment }) {
  const expiresAt = Date.parse(payment.expiresAt);
  const [expired, setExpired] = useState(() => Date.now() >= expiresAt);
  useEffect(() => {
    const wait = expiresAt - Date.now();
    if (wait <= 0) return;
    const timer = setTimeout(() => setExpired(true), Math.min(wait, 2 ** 31 - 1));
    return () => clearTimeout(timer);
  }, [expiresAt]);

  const time = new Date(expiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="flex flex-col gap-1.5 text-[13px] text-muted">
      {expired ? (
        <span className="inline-flex min-h-11 items-center justify-center rounded-full bg-line px-4 font-semibold">
          {CHAT_TEXT.payExpired}
        </span>
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
      <span>{expired ? CHAT_TEXT.payNote : `${CHAT_TEXT.payExpires(time)}. ${CHAT_TEXT.payNote}.`}</span>
    </div>
  );
}
