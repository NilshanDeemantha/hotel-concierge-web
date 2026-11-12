"use client";

import { signOut } from "firebase/auth";
import Link from "next/link";
import { ROUTES } from "@/constants";
import { HEADER_TEXT } from "@/content/site";
import { useAuthUser } from "@/hooks/useAuthUser";
import { auth } from "@/lib/firebase";
import { headerButtonClass } from "./SiteHeader.styles";

export function AccountNav() {
  const user = useAuthUser();

  return (
    // Empty while checking, so "Log in" never flashes for a signed-in visitor.
    <nav aria-label={HEADER_TEXT.accountNavLabel} className="flex min-h-11 items-center gap-2">
      {user === null && (
        <Link href={ROUTES.login} className={`${headerButtonClass} bg-brand text-white`}>
          {HEADER_TEXT.login}
        </Link>
      )}
      {user && (
        <>
          <span className="hidden max-w-40 truncate text-sm text-muted @xl:inline">
            {user.displayName ?? user.email}
          </span>
          <button
            type="button"
            className={`${headerButtonClass} border border-brand text-brand`}
            onClick={() => signOut(auth)}
          >
            {HEADER_TEXT.signOut}
          </button>
        </>
      )}
    </nav>
  );
}
