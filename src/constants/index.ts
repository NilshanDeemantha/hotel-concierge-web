export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  // Where an admin lands. /a itself only redirects here.
  admin: "/a/conversation",
} as const;

/** One page per admin menu item. A new section is its page, an entry here and its label in ADMIN_TEXT.sections. */
export const ADMIN_PATHS = { conversations: "/a/conversation", bookings: "/a/bookings", rooms: "/a/rooms" } as const;

/** Anchor ids of the home page sections, shared by the sections and the header links. */
export const SECTION_IDS = {
  gallery: "gallery",
  rooms: "rooms",
  concierge: "concierge",
  experiences: "experiences",
  contact: "contact",
} as const;

export const CHAT_STORAGE_KEY = "chat-panel";

// Same limit as the server, which is the check that counts.
export const MAX_MESSAGE_CHARS = 1000;

// Same pattern as the server, which is the check that counts.
export const PHONE_PATTERN = "[+0-9 \\(\\)\\-]{6,20}";

export const HERO_IMAGE = {
  src: "/images/hero-beach.jpg",
  alt: "Palm trees on a red-earth headland above a turquoise sea",
} as const;
