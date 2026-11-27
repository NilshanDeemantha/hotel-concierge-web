import { firebaseConfig } from "@/config/firebase";
import type { ChatPayment } from "@/components/chat/ChatPanel/ChatPanel.types";

// Only photos from our own Storage bucket are shown; any other link in a message is ignored.
const PHOTO_PREFIX = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/`;
export const photosOf = (value: unknown) =>
  Array.isArray(value) ? value.filter((u): u is string => typeof u === "string" && u.startsWith(PHOTO_PREFIX)) : [];

// Only a Stripe Checkout address is ever offered as a payment link, whatever a message says.
const CHECKOUT_PREFIX = "https://checkout.stripe.com/";
export const paymentOf = (value: unknown): ChatPayment | undefined => {
  const { url, expiresAt, status } = (value ?? {}) as Partial<ChatPayment>;
  return typeof url === "string" && url.startsWith(CHECKOUT_PREFIX) && typeof expiresAt === "string" && !Number.isNaN(Date.parse(expiresAt))
    ? { url, expiresAt, status: status === "paid" || status === "closed" ? status : undefined }
    : undefined;
};
