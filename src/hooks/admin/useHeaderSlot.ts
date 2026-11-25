import { useSyncExternalStore } from "react";

export const HEADER_SLOT_ID = "admin-header-slot";

const noSubscription = () => () => {};

/** The spot at the right of the page title, for a section's own buttons (render into it with createPortal). */
export function useHeaderSlot() {
  return useSyncExternalStore(noSubscription, () => document.getElementById(HEADER_SLOT_ID), () => null);
}
