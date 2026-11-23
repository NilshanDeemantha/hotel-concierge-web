import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { ADMIN_TEXT } from "@/content/admin";

export const metadata: Metadata = { title: ADMIN_TEXT.pageTitle };

export default function Page() {
  return <AdminDashboard />;
}
