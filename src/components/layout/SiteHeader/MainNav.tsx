import Link from "next/link";
import { HEADER_TEXT, NAV_LINKS } from "@/content/site";

export function MainNav() {
  return (
    <nav aria-label={HEADER_TEXT.mainNavLabel} className="hidden gap-7 text-[15px] font-medium @3xl:flex">
      {NAV_LINKS.map((link) => (
        <Link key={link.href} href={link.href}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
