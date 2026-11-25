"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { ADMIN_TEXT } from "@/content/admin";
import { smallButtonClass } from "@/styles/classes";
import type { LoadErrorProps } from "./LoadError.types";

/** A failed live read: a toast, the message left on the page, and a button that subscribes again. */
export function LoadError({ message, onRetry }: LoadErrorProps) {
  useEffect(() => {
    if (message) toast.error(message);
  }, [message]);
  return (
    <>
      <p className="text-sm text-muted">{message}</p>
      {message && (
        <button type="button" className={`${smallButtonClass} self-start`} onClick={onRetry}>
          {ADMIN_TEXT.retry}
        </button>
      )}
    </>
  );
}
