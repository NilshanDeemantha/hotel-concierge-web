import type { Metadata } from "next";
import { BookingsTab } from "@/components/admin/BookingsTab";
import { ADMIN_TEXT } from "@/content/admin";

export const metadata: Metadata = { title: ADMIN_TEXT.sections.bookings };

export default function Page() {
  return <BookingsTab />;
}
