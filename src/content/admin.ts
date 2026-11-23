import { ROOMS } from "@/content/home";

// The same three names the home page shows, so the server and the site agree on room types.
export const ROOM_TYPES = ROOMS.map((room) => room.name);

export const ADMIN_TEXT = {
  pageTitle: "Admin",
  title: "Admin",
  checking: "Checking your access…",
  loading: "Loading…",
  noDate: "—",
  yes: "Yes",
  no: "No",
  save: "Save",
  saving: "Saving…",
  cancel: "Cancel",
  retry: "Try again",
  signOut: "Sign out",
  navLabel: "Admin sections",
  sections: { conversations: "Conversations", rooms: "Rooms", calendar: "Calendar" },
} as const;

export const CONVERSATIONS_TEXT = {
  listLabel: "Conversations",
  empty: "No conversations yet.",
  messages: (count: number) => `${count} ${count === 1 ? "message" : "messages"}`,
  lastActivity: "Last activity",
  choose: "Choose a conversation to read it.",
  emptyThread: "This conversation has no messages.",
  roles: { user: "Guest", assistant: "Xenia" } as Record<string, string>,
} as const;

export const ROOMS_TEXT = {
  number: "Number",
  type: "Type",
  active: "Active",
  actions: "Actions",
  empty: "No rooms yet. Add one below.",
  edit: "Edit",
  deactivate: "Deactivate",
  reactivate: "Reactivate",
  addTitle: "Add a room",
  add: "Add room",
  numberHint: "1 to 10 letters, digits or dashes.",
  editNumber: (number: string) => `Number for room ${number}`,
  editType: (number: string) => `Type for room ${number}`,
} as const;

export const STATUS_TEXT = {
  free: { label: "Free", short: "" },
  booked: { label: "Booked", short: "B" },
  blocked: { label: "Blocked", short: "X" },
} as const;

export const CALENDAR_TEXT = {
  month: "Month",
  room: "Room",
  noRooms: "No active rooms. Add one in the Rooms section.",
  legend: "B = booked, X = blocked, empty = free.",
  cell: (room: string, date: string, status: string, note?: string) =>
    `Room ${room}, ${date}: ${status}${note ? ` (${note})` : ""}`,
  formTitle: "Change availability",
  chooseRoom: "Choose a room",
  from: "From (first night)",
  to: "To (check-out day, stays free)",
  status: "Status",
  note: "Note (optional)",
  submit: "Save nights",
  rangeHint: "Up to 60 nights.",
} as const;
