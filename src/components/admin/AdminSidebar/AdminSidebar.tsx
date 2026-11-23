"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";
import { ADMIN_TEXT } from "@/content/admin";
import { useAuthUser } from "@/hooks/useAuthUser";
import { auth } from "@/lib/firebase";
import { smallButtonClass } from "@/styles/classes";
import type { AdminSidebarProps, Section } from "./AdminSidebar.types";

/** Admin navigation: a left column on wide screens, a strip across the top on narrow ones. */
export function AdminSidebar({ section, onSelect }: AdminSidebarProps) {
  const user = useAuthUser();
  const router = useRouter();

  return (
    <aside className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line bg-surface px-4 py-3 @3xl:sticky @3xl:top-0 @3xl:h-dvh @3xl:w-60 @3xl:shrink-0 @3xl:flex-col @3xl:items-stretch @3xl:border-r @3xl:border-b-0 @3xl:py-6">
      <p className="font-serif text-2xl font-medium text-brand">{ADMIN_TEXT.title}</p>
      <nav aria-label={ADMIN_TEXT.navLabel} className="flex flex-wrap gap-1 @3xl:flex-col">
        {(Object.keys(ADMIN_TEXT.sections) as Section[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-current={section === key ? "page" : undefined}
            className={`min-h-11 rounded-full px-4 text-left font-semibold ${
              section === key ? "bg-brand-soft text-brand" : "text-muted"
            }`}
            onClick={() => onSelect(key)}
          >
            {ADMIN_TEXT.sections[key]}
          </button>
        ))}
      </nav>
      <div className="flex min-w-0 items-center gap-3 @3xl:mt-auto @3xl:flex-col @3xl:items-stretch">
        {user?.email && <span className="min-w-0 truncate text-sm text-muted">{user.email}</span>}
        <button
          type="button"
          className={smallButtonClass}
          onClick={() => signOut(auth).then(() => router.push(ROUTES.login))}
        >
          {ADMIN_TEXT.signOut}
        </button>
      </div>
    </aside>
  );
}
