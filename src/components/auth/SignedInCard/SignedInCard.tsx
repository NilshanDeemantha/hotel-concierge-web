"use client";

import { signOut } from "firebase/auth";
import { AUTH_TEXT } from "@/content/auth";
import { auth } from "@/lib/firebase";
import { authCardClass, primaryButtonClass } from "@/styles/classes";
import type { SignedInCardProps } from "./SignedInCard.types";

export function SignedInCard({ user }: SignedInCardProps) {
  return (
    <div className={authCardClass}>
      <h1 className="font-serif text-3xl font-medium">
        {AUTH_TEXT.hello}
        {user.displayName ? `, ${user.displayName}` : ""}
      </h1>
      <p className="mt-2 break-words text-muted">{user.email}</p>
      <button type="button" className={`${primaryButtonClass} mt-6`} onClick={() => signOut(auth)}>
        {AUTH_TEXT.signOut}
      </button>
    </div>
  );
}
