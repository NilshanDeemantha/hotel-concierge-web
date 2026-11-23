export const ADMIN_TEXT = {
  pageTitle: "Admin",
  title: "Admin",
  checking: "Checking your access…",
  loading: "Loading…",
  noDate: "—",
  retry: "Try again",
  signOut: "Sign out",
  signOutFailed: "Could not sign out. Please try again.",
  permissionDenied: "This account cannot see admin data. Ask the owner to give it admin access.",
  loadFailed: "Could not load this data. Check your connection and try again.",
  navLabel: "Admin sections",
  sections: { conversations: "Conversations" },
} as const;

export const CONVERSATIONS_TEXT = {
  listLabel: "Conversations",
  empty: "No conversations yet.",
  unknownGuest: "Unknown guest",
  messages: (count: number) => `${count} ${count === 1 ? "message" : "messages"}`,
  back: "Back to conversations",
  choose: "Choose a conversation to read it.",
  emptyThread: "This conversation has no messages.",
  placeholder: "Reply as staff…",
  send: "Send",
  sendFailed: "Could not send. Try again.",
  roles: { user: "Guest", assistant: "Xenia", staff: "Staff" } as Record<string, string>,
} as const;
