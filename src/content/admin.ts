import { MODEL_CONFIG } from "@/models/config";

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
  menu: "Menu",
  sections: { conversations: "Conversations", rooms: "Rooms" },
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

// Must match ROOM_TYPES and AMENITIES in firestore.rules of the server repository.
export const ROOM_TYPES = ["Garden Room", "Sea View Deluxe", "Family Suite"] as const;
export const AMENITIES = [
  "Air conditioning", "Ceiling fan", "Wardrobe", "Wi-Fi", "TV", "Hot water",
  "Mini fridge", "Tea and coffee", "Safe", "Desk", "Balcony", "Sea view",
  "Bathtub", "Hair dryer", "Iron", "Garden view", "Pool view", "Private bathroom",
  "Free toiletries", "Towels", "Slippers", "Mosquito net", "Seating area", "Telephone",
  "Satellite channels", "Daily housekeeping", "Room service", "Laundry service (paid)", "Free parking", "Breakfast included",
  "Extra bed on request", "Pets allowed", "Non-smoking", "Smoking allowed",
] as const;
// Ticked when a new room is started; staff untick what the room does not have.
export const DEFAULT_AMENITIES: readonly (typeof AMENITIES)[number][] = [
  "Wi-Fi", "Hot water", "Private bathroom", "Free toiletries", "Towels", "Wardrobe", "Daily housekeeping",
];

// Must match the room rules in firestore.rules and the 5 MB limit in storage.rules (both in the server repository).
export const MAX_PRICE = 10_000_000; // whole rupees per night
export const MAX_NOTICE = 300;
export const MIN_PHOTOS = 5;
export const MAX_PHOTOS = 10;
// Times are "HH:MM" on a 24-hour clock. Check-out is earlier in the day than check-in, by at least MIN_GAP_MINUTES.
export const DEFAULT_CHECK_IN = "14:00";
export const DEFAULT_CHECK_OUT = "11:00";
export const MIN_GAP_MINUTES = 120;
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024 - 1;

export const ROOMS_TEXT = {
  listLabel: "Rooms",
  empty: "No rooms yet. Add the first one.",
  add: "Add a room",
  edit: "Edit",
  formTitleNew: "New room",
  formTitleEdit: "Edit room",
  number: "Room number",
  name: "Room name",
  type: "Room type",
  features: "Features and facilities",
  price: `Price per night (${MODEL_CONFIG.currency})`,
  checkIn: "Check-in time",
  checkOut: "Check-out time",
  timesHint: `Check-out must be at least ${MIN_GAP_MINUTES / 60} hours earlier in the day than check-in.`,
  badTimes: `Check-out must be at least ${MIN_GAP_MINUTES / 60} hours earlier than check-in.`,
  checkInOut: (inTime: string, outTime: string) => `Check-in ${inTime} · Check-out ${outTime}`,
  notice: "Special notice (optional)",
  noticeHint: "Shown with the room, for example “Second floor, no lift”.",
  active: "Available to book",
  inactive: "Not bookable",
  photos: "Room photos",
  photosHint: `At least ${MIN_PHOTOS}, at most ${MAX_PHOTOS}. Images up to 5 MB each.`,
  photosCount: (n: number) => `${n} of ${MAX_PHOTOS} photos`,
  addPhotos: "Add photos",
  uploading: "Uploading…",
  removePhoto: (n: number) => `Remove photo ${n}`,
  photosLabel: "All photos of this room",
  showPhoto: (n: number) => `Show photo ${n}`,
  photoAlt: (n: number) => `Room photo ${n}`,
  notAnImage: "Only image files can be added.",
  tooBig: "Each photo must be under 5 MB.",
  tooMany: `A room can have at most ${MAX_PHOTOS} photos.`,
  uploadFailed: "Some photos could not be uploaded. Try again.",
  badNumber: "Room number must be 1 to 10 letters, digits or dashes.",
  badName: "Room name must be 1 to 60 characters.",
  badPrice: "Price must be a whole number above 0.",
  badNotice: "The special notice can be at most 300 characters.",
  badFeatures: "A room cannot be both non-smoking and smoking allowed.",
  numberTaken: "Room number already in use.",
  needPhotos: `Add at least ${MIN_PHOTOS} photos to save the room.`,
  save: "Save room",
  saved: "Room saved.",
  saving: "Saving…",
  cancel: "Cancel",
  saveFailed: "Could not save the room. Try again.",
  perNight: (n: number) => `${MODEL_CONFIG.currency} ${n.toLocaleString(MODEL_CONFIG.locale)} / night`,
} as const;

export const MAX_NIGHTS = 60; // at most this many nights in one change, as in admin_set_availability
export const MAX_AVAILABILITY_NOTE = 200;

const dayLabel = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString(MODEL_CONFIG.locale, { day: "numeric", month: "short", timeZone: "UTC" });

export const AVAILABILITY_TEXT = {
  open: "Availability",
  title: (room: string) => `Availability · ${room}`,
  close: "Back to rooms",
  loadHint: "Days are free unless marked. Bookings made through Xenia show here as booked.",
  prevMonth: "Previous month",
  nextMonth: "Next month",
  weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  status: { free: "Available", booked: "Booked", blocked: "Removed" } as Record<string, string>,
  dayLabel,
  dayAria: (date: string, status: string) => `${dayLabel(date)}: ${status}`,
  taken: "Taken days this month",
  noneTaken: "Nothing booked or removed this month.",
  change: "Change availability",
  from: "First night",
  until: "Check-out date",
  untilHint: "The night of the check-out date is not included.",
  action: "What to do",
  actions: {
    blocked: "Remove from availability",
    booked: "Mark as booked",
    free: "Make available again",
  } as Record<string, string>,
  note: "Note (optional)",
  notePlaceholder: "Guest name, or the reason (for example repairs)",
  nights: (n: number) => `${n} ${n === 1 ? "night" : "nights"}`,
  conflict: (days: string[]) => `Already taken: ${days.map(dayLabel).join(", ")}. Make them available first, or pick other dates.`,
  badDates: "Choose both dates.",
  badRange: "The check-out date must be after the first night.",
  tooLong: `At most ${MAX_NIGHTS} nights at a time.`,
  badNote: `The note can be at most ${MAX_AVAILABILITY_NOTE} characters.`,
  takenOn: (date: string) => `Already taken on ${dayLabel(date)}.`,
  apply: "Apply",
  applying: "Saving…",
  done: { blocked: "Removed from availability.", booked: "Marked as booked.", free: "Available again." } as Record<string, string>,
  failed: "Could not change availability. Try again.",
} as const;
