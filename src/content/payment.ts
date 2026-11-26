export const PAYMENT_TEXT = {
  success: {
    pageTitle: "Payment received",
    title: "Thank you, your payment is on its way",
    body: "We are confirming it now. Xenia will message you in the chat as soon as your booking is confirmed, usually within a minute.",
  },
  cancelled: {
    pageTitle: "Payment not completed",
    title: "Payment not completed",
    body: "Nothing was charged. Your room is still held until the time in Xenia's message. Open the chat and use the Pay now button again, or ask Xenia to send the payment link again. If it is not paid in time, the booking is cancelled automatically.",
  },
  back: "Back to the site",
} as const;
