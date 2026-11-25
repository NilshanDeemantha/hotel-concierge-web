// Settings shared by every model (src/models). Change one here and all of them follow.
export const MODEL_CONFIG = {
  currency: "LKR",
  locale: "en-LK",
  // shortcut: a list reads only this many documents; add paging when a hotel has more.
  // Messages are also unordered (no composite index), so a longer thread may miss some: add an index on
  // (conversationId, createdAt) and orderBy when threads grow that long.
  limits: { rooms: 200, conversations: 100, messages: 500, availability: 120 },
} as const;
