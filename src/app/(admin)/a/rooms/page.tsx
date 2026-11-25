import type { Metadata } from "next";
import { RoomsTab } from "@/components/admin/RoomsTab";
import { ADMIN_TEXT } from "@/content/admin";

export const metadata: Metadata = { title: ADMIN_TEXT.sections.rooms };

export default function Page() {
  return <RoomsTab />;
}
