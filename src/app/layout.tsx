import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SITE } from "@/content/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: SITE.fullName, template: `%s · ${SITE.fullName}` },
  description: SITE.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} h-full antialiased`}
    >
      <body>
        <ChatProvider>
          <SiteHeader />
          {children}
        </ChatProvider>
      </body>
    </html>
  );
}
