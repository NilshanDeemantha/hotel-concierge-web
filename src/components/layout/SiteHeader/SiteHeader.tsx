import Link from "next/link";
import { ROUTES } from "@/constants";
import { SITE } from "@/content/site";
import { AccountNav } from "./AccountNav";
import { MainNav } from "./MainNav";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between gap-4 px-4 py-4 @xl:px-8 @4xl:px-12">
      <Link href={ROUTES.home} className="font-serif text-xl font-semibold text-brand @xl:text-2xl">
        {SITE.name}
      </Link>
      <MainNav />
      <AccountNav />
    </header>
  );
}
