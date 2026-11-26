import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/constants";
import { PAYMENT_TEXT } from "@/content/payment";
import { authCardClass, primaryButtonClass } from "@/styles/classes";

// Not for search engines: the guest arrives here from Stripe after paying or leaving.
export const metadata: Metadata = { title: PAYMENT_TEXT.success.pageTitle, robots: { index: false, follow: false } };

export default function Page() {
  return (
    <main className="grid flex-1 place-items-center px-4 py-12">
      <div className={`${authCardClass} w-full max-w-[460px]`}>
        <h1 className="font-serif text-3xl font-medium">{PAYMENT_TEXT.success.title}</h1>
        <p className="mt-3 text-muted">{PAYMENT_TEXT.success.body}</p>
        <Link href={ROUTES.home} className={`${primaryButtonClass} mt-6 inline-flex items-center justify-center`}>
          {PAYMENT_TEXT.back}
        </Link>
      </div>
    </main>
  );
}
