/** The admin area: its own shell, without the public header or the chat. */
export default function AdminLayout({ children }: LayoutProps<"/">) {
  return <div className="@container min-h-dvh">{children}</div>;
}
