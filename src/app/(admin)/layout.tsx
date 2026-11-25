import { AdminDashboard } from "@/components/admin/AdminDashboard";

/** The admin area: its own shell (sidebar, access check), without the public header or the chat. */
export default function AdminLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="@container min-h-dvh">
      <AdminDashboard>{children}</AdminDashboard>
    </div>
  );
}
