import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import { ChatProvider } from "@/components/ChatProvider";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Thambili Bay Hotel", template: "%s · Thambili Bay Hotel" },
  description: "Demo AI concierge for a fictional boutique hotel on the Galle coast.",
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
