import type { Metadata } from "next";
import { ConversationsTab } from "@/components/admin/ConversationsTab";
import { ADMIN_TEXT } from "@/content/admin";

export const metadata: Metadata = { title: ADMIN_TEXT.sections.conversations };

export default function Page() {
  return <ConversationsTab />;
}
