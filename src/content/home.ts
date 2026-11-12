export const HERO = {
  title: "Slow days on the Galle coast",
  intro:
    "Eighteen rooms between the palms and the sea. Xenia, our AI concierge, answers questions, checks rooms and books your stay, at any hour.",
  chatCta: "Chat with Xenia",
  roomsCta: "See the rooms",
} as const;

export const GALLERY_SECTION = {
  eyebrow: "Around the hotel",
  title: "A look around",
  description: "The beach, the pool, the spa and the rooms, all within a few steps of each other.",
  regionLabel: "Photos of the hotel",
  previous: "Previous photo",
  next: "Next photo",
  autoSlideMs: 4000,
} as const;

// Add a photo here (and put the file in public/images) and it joins the slider.
export const GALLERY = [
  { src: "/images/hotel-front.jpg", alt: "A white seafront hotel among palm trees above a sandy cove" },
  { src: "/images/hero-beach.jpg", alt: "Palm trees on a red-earth headland above a turquoise sea" },
  { src: "/images/exp-pool.jpg", alt: "A swimming pool surrounded by palm trees" },
  { src: "/images/exp-spa.jpg", alt: "A massage bed prepared with towels and flowers" },
  { src: "/images/exp-dining.jpg", alt: "A table set for a meal beside the ocean" },
  { src: "/images/room-seaview.jpg", alt: "Open balcony doors looking out over the sea" },
  { src: "/images/room-garden.jpg", alt: "White tables and chairs on a terrace in a tropical garden" },
] as const;

export const ROOMS_SECTION = {
  eyebrow: "Stay",
  title: "Three kinds of room",
  description: "Every room comes with breakfast. Ask Xenia for prices for your dates.",
} as const;

export const ROOMS = [
  {
    name: "Garden Room",
    detail: "Queen bed and a private terrace among the palms.",
    tags: ["Sleeps 2", "Terrace", "Breakfast"],
    image: "/images/room-garden.jpg",
    alt: "White tables and chairs on a terrace in a tropical garden",
  },
  {
    name: "Sea View Deluxe",
    detail: "King bed and a balcony that looks over the bay.",
    tags: ["Sleeps 2", "Balcony", "Breakfast"],
    image: "/images/room-seaview.jpg",
    alt: "Open balcony doors looking out over the sea",
  },
  {
    name: "Family Suite",
    detail: "Two connected rooms with space for the whole family.",
    tags: ["Sleeps 4", "Two rooms", "Breakfast"],
    image: "/images/room-suite.jpg",
    alt: "A bright hotel bedroom with a large bed",
  },
] as const;

export const CONCIERGE_SECTION = {
  eyebrow: "Meet Xenia, our AI concierge",
  title: "What Xenia can do for you",
  chatCta: "Chat with Xenia",
} as const;

export const CONCIERGE = [
  {
    title: "Check rooms and book",
    text: "Tell her your dates. She shows what is free, and nothing is booked until you tap Confirm.",
    icon: "M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zM3 10h18M8 3v4M16 3v4M8.5 15.5l2.3 2.3 4.7-4.7",
  },
  {
    title: "Prices for your dates",
    text: "Ask what a room costs for the nights you have in mind and get the total for the stay.",
    icon: "M3 12V4h8l10 10-8 8zM7.5 8.5h.01",
  },
  {
    title: "Manage your booking",
    text: "Look up a booking with its reference and email, or cancel it if your plans change.",
    icon: "M9 4h6v3H9zM7 5.5H5.5A1.5 1.5 0 0 0 4 7v12.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V7a1.5 1.5 0 0 0-1.5-1.5H17M8 12h8M8 16h5",
  },
  {
    title: "Help during your stay",
    text: "Order room service, ask for housekeeping or report a problem in your room, without calling the desk.",
    icon: "M4 18h16M5 18a7 7 0 0 1 14 0M12 8V6M10 6h4",
  },
  {
    title: "Dining, spa and activities",
    text: "Ask about the restaurant, the spa, the pool, boat rides and anything else there is to do.",
    icon: "M6 3v7a2 2 0 0 0 4 0V3M8 12v9M17 3c-2 2-3 4.5-3 8h3zM17 11v10",
  },
  {
    title: "Getting here and hotel rules",
    text: "Directions, check-in and check-out times, and the hotel's policies, answered straight away.",
    icon: "M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  },
] as const;

export const EXPERIENCES_SECTION = {
  eyebrow: "During your stay",
  title: "More than a room",
  description: "Ask Xenia for times, prices and how to join any of these.",
} as const;

export const EXPERIENCES = [
  {
    id: "dining",
    title: "Dining",
    text: "Breakfast on the terrace comes with every room. Lunch and dinner are served by the sea.",
    icon: "M6 3v7a2 2 0 0 0 4 0V3M8 12v9M17 3c-2 2-3 4.5-3 8h3zM17 11v10",
  },
  {
    id: "spa",
    title: "Spa",
    text: "Massages and treatments in a quiet garden room, for slowing down after the beach.",
    icon: "M12 20c-3-1-5-4-5-8 3 0 5 2 5 4 0-2 2-4 5-4 0 4-2 7-5 8zM12 4c2 2 3 4 3 7M12 4c-2 2-3 4-3 7",
  },
  {
    id: "pool",
    title: "Pool",
    text: "A pool among the palms with loungers and shade, a few steps from the sand.",
    icon: "M8 14V5a2 2 0 0 1 4 0M14 14V5a2 2 0 0 1 4 0M8 9h6M2 18c2 0 2-1.5 4-1.5S8 18 10 18s2-1.5 4-1.5S16 18 18 18s2-1.5 4-1.5M2 22c2 0 2-1.5 4-1.5S8 22 10 22s2-1.5 4-1.5S16 22 18 22s2-1.5 4-1.5",
  },
  {
    id: "boat",
    title: "Boat rides",
    text: "Morning and sunset rides along the coast, leaving from the bay in front of the hotel.",
    icon: "M4 16h16l-2.5 4h-11zM12 3v13M12 4c3 2 5 5 5 9h-5M12 7c-2 1.5-3.5 3.5-4 6h4",
  },
  {
    id: "whale",
    title: "Whale watching",
    text: "Early trips out to sea in season, with a chance to see whales and dolphins.",
    icon: "M2 14c0-4 4-7 9-7s8 3 9 6l2-3v8l-2-3c-1 3-4 5-9 5s-9-2-9-6zM7 12h.01M9 7c0-2 1-3 2-4M9 7c0-2-1-3-2-4",
  },
  {
    id: "fort",
    title: "Galle Fort walk",
    text: "A guided walk through the old fort: ramparts, the lighthouse and narrow streets of cafes.",
    icon: "M9 21l1.5-13h3L15 21zM10 8l2-4 2 4M5 21h14M12 4V2M8 3L6 2M16 3l2-1",
  },
  {
    id: "surf",
    title: "Surf lessons",
    text: "Lessons for beginners on the gentle breaks nearby, with boards provided.",
    icon: "M3 19c4 0 6-2 6-6 0-3-2-5-5-6 6-2 13 2 13 9 0 2-1 3-3 3H3z",
  },
  {
    id: "cooking",
    title: "Cooking class",
    text: "Learn to cook a Sri Lankan rice and curry with our kitchen team, then eat it for lunch.",
    icon: "M7 11a4 4 0 1 1 2-7 4 4 0 0 1 6 0 4 4 0 1 1 2 7v8H7zM7 16h10",
  },
] as const;

export const CONTACT_SECTION = {
  eyebrow: "Find us",
  title: "Visit Thambili Bay",
  description: "On the Galle coast, a short ride from the fort. Ask Xenia for directions at any hour.",
  addressLabel: "Address",
  phoneLabel: "Phone",
  emailLabel: "Email",
  timesLabel: "Times",
  checkInLabel: "Check-in",
  checkOutLabel: "Check-out",
  receptionLabel: "Reception",
  directionsCta: "Open in Maps",
  gettingHereTitle: "Getting here",
  demoNote: "Demo details: this hotel is fictional, so the phone number and email are placeholders.",
} as const;

export const GETTING_HERE = [
  { place: "Galle Fort", how: "10 minutes by tuk-tuk" },
  { place: "Galle railway station", how: "15 minutes by car" },
  { place: "Colombo airport", how: "About 2 hours by the Southern Expressway" },
] as const;

export const FOOTER = {
  contactTitle: "Contact",
  copyright: "© 2026 Thambili Bay. All rights reserved.",
  disclaimer:
    "Thambili Bay is a fictional hotel. This site is a portfolio demo, so please don't enter real personal details. Photos from Unsplash.",
} as const;
