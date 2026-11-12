import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
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
      <body className="mx-auto flex min-h-full w-full max-w-5xl flex-col">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
