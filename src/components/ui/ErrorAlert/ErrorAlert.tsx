import { Icon } from "@/components/ui/Icon";
import type { ErrorAlertProps } from "./ErrorAlert.types";

/** Always renders the live region, so a screen reader announces the message when it appears. */
export function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div role="alert">
      {message && (
        <p className="flex items-start gap-2 rounded-xl bg-[#FBEDE8] px-3 py-2.5 text-sm text-[#9A3A1B]">
          <Icon size={18} className="mt-px flex-none">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5M12 16.2v.3" />
          </Icon>
          <span>{message}</span>
        </p>
      )}
    </div>
  );
}
