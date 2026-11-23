import { ChatProvider } from "@/components/chat/ChatProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";

/** The public pages: site header and the Xenia chat. */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <ChatProvider>
      <SiteHeader />
      {children}
    </ChatProvider>
  );
}
