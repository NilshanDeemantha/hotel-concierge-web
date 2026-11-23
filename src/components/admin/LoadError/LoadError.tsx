import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { ADMIN_TEXT } from "@/content/admin";
import { smallButtonClass } from "@/styles/classes";
import type { LoadErrorProps } from "./LoadError.types";

/** A failed live read: the message, and a button that subscribes again. */
export function LoadError({ message, onRetry }: LoadErrorProps) {
  return (
    <>
      <ErrorAlert message={message} />
      {message && (
        <button type="button" className={`${smallButtonClass} self-start`} onClick={onRetry}>
          {ADMIN_TEXT.retry}
        </button>
      )}
    </>
  );
}
