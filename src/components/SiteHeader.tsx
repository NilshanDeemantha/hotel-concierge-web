"use client";

import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

const linkClass =
  "inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold";

export function SiteHeader() {
  // undefined = still checking, null = signed out
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  return (
    <header className="flex items-center justify-between gap-4 px-4 py-4 @xl:px-8 @4xl:px-12">
      <Link href="/" className="font-serif text-xl font-semibold text-brand @xl:text-2xl">
        Thambili Bay
      </Link>

      <nav aria-label="Main" className="hidden gap-7 text-[15px] font-medium @3xl:flex">
        <Link href="/#rooms">Rooms</Link>
        <Link href="/#concierge">Xenia</Link>
        <Link href="/#experiences">Experiences</Link>
      </nav>

      {/* Empty while checking, so "Log in" never flashes for a signed-in visitor. */}
      <nav aria-label="Account" className="flex min-h-11 items-center gap-2">
        {user === null && (
          <Link href="/login" className={`${linkClass} bg-brand text-white`}>
            Log in
          </Link>
        )}
        {user && (
          <>
            <span className="hidden max-w-40 truncate text-sm text-muted @xl:inline">
              {user.displayName ?? user.email}
            </span>
            <button
              type="button"
              className={`${linkClass} border border-brand text-brand`}
              onClick={() => signOut(auth)}
            >
              Sign out
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
