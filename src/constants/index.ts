export const ROUTES = { home: "/", login: "/login", signup: "/signup" } as const;

/** Anchor ids of the home page sections, shared by the sections and the header links. */
export const SECTION_IDS = {
  gallery: "gallery",
  rooms: "rooms",
  concierge: "concierge",
  experiences: "experiences",
  contact: "contact",
} as const;

export const CHAT_STORAGE_KEY = "chat-panel";

// Same pattern as the server, which is the check that counts.
export const PHONE_PATTERN = "[+0-9 \\(\\)\\-]{6,20}";

export const HERO_IMAGE = {
  src: "/images/hero-beach.jpg",
  alt: "Palm trees on a red-earth headland above a turquoise sea",
} as const;
