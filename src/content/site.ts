import { SECTION_IDS } from "@/constants";

export const SITE = {
  name: "Thambili Bay",
  fullName: "Thambili Bay Hotel",
  location: "Galle coast, Sri Lanka",
  description: "Demo AI concierge for a fictional boutique hotel on the Galle coast.",
  conciergeName: "Xenia",
} as const;

export const NAV_LINKS = [
  { label: "Rooms", href: `/#${SECTION_IDS.rooms}` },
  { label: "Xenia", href: `/#${SECTION_IDS.concierge}` },
  { label: "Experiences", href: `/#${SECTION_IDS.experiences}` },
  { label: "Contact", href: `/#${SECTION_IDS.contact}` },
] as const;

export const HEADER_TEXT = {
  mainNavLabel: "Main",
  accountNavLabel: "Account",
  login: "Log in",
  signOut: "Sign out",
} as const;

// Placeholder details for a fictional hotel: the phone number and email are not real.
export const CONTACT = {
  addressLines: ["12 Beach Road", "Galle 80000", "Sri Lanka"],
  phone: "+94 91 000 0000",
  phoneHref: "tel:+94910000000",
  email: "reception@thambilibay.example",
  emailHref: "mailto:reception@thambilibay.example",
  mapsHref: "https://www.google.com/maps/search/?api=1&query=Galle+Fort+Sri+Lanka",
  checkIn: "From 2:00 pm",
  checkOut: "Until 11:00 am",
  reception: "Open 24 hours",
} as const;
