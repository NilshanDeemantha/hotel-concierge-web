"use client";

import { signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { Icon } from "@/components/ui/Icon";
import { ADMIN_PATHS, ROUTES } from "@/constants";
import { ADMIN_TEXT } from "@/content/admin";
import { useAuthUser } from "@/hooks/useAuthUser";
import { auth } from "@/lib/firebase";
import { smallButtonClass } from "@/styles/classes";
import type { AdminSidebarProps, Section } from "./AdminSidebar.types";

/** Admin navigation: a left column on wide screens, a strip across the top on narrow ones. */
export function AdminSidebar({ section }: AdminSidebarProps) {
  const user = useAuthUser();
  const router = useRouter();
  const [open, setOpen] = useState(false); // narrow screens only: wide screens always show the sidebar

  function handleSignOut() {
    signOut(auth).then(
      () => router.replace(ROUTES.login),
      () => toast.error(ADMIN_TEXT.signOutFailed),
    );
  }

  // A plain div: the nav inside is the landmark.
  return (
    <div className="border-b border-line bg-surface px-4 py-3 @3xl:sticky @3xl:top-0 @3xl:flex @3xl:h-dvh @3xl:w-60 @3xl:shrink-0 @3xl:flex-col @3xl:overflow-y-auto @3xl:border-r @3xl:border-b-0 @3xl:py-6">
      <button
        type="button"
        aria-label={ADMIN_TEXT.menu}
        aria-expanded={open}
        aria-controls="admin-menu"
        className="grid size-11 place-items-center rounded-full border border-line @3xl:hidden"
        onClick={() => setOpen((o) => !o)}
      >
        <Icon size={22}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </Icon>
      </button>
      {open && (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-black/30 @3xl:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      {/* Narrow screens: the same column as on desktop, laid over the page. Wide screens: part of the page. */}
      <div
        id="admin-menu"
        className={`${open ? "fixed inset-y-0 left-0 z-40 flex w-60 overflow-y-auto border-r border-line bg-surface px-4 py-6 shadow-xl" : "hidden"} flex-col gap-4 @3xl:static @3xl:z-auto @3xl:flex @3xl:flex-1 @3xl:border-0 @3xl:p-0 @3xl:shadow-none`}
      >
        <p className="font-serif text-2xl font-medium text-brand @3xl:text-center">{ADMIN_TEXT.title}</p>
        <nav aria-label={ADMIN_TEXT.navLabel} className="flex flex-col gap-1">
          {(Object.keys(ADMIN_TEXT.sections) as Section[]).map((key) => (
            <Link
              key={key}
              href={ADMIN_PATHS[key]}
              aria-current={section === key ? "page" : undefined}
              className={`flex min-h-11 items-center rounded-full px-4 font-semibold ${
                section === key ? "bg-brand-soft text-brand" : "text-muted"
              }`}
              onClick={() => setOpen(false)} // collapse the menu on narrow screens
            >
              {ADMIN_TEXT.sections[key]}
            </Link>
          ))}
        </nav>
        <div className="flex min-w-0 flex-col gap-3 @3xl:mt-auto">
          {user?.email && <span className="min-w-0 truncate text-sm text-muted">{user.email}</span>}
          <button type="button" className={smallButtonClass} onClick={handleSignOut}>
            {ADMIN_TEXT.signOut}
          </button>
        </div>
      </div>
    </div>
  );
}
