"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { AdminSidebar, type Section } from "@/components/admin/AdminSidebar";
import { ADMIN_PATHS, ROUTES } from "@/constants";
import { ADMIN_TEXT } from "@/content/admin";
import { HEADER_SLOT_ID } from "@/hooks/admin/useHeaderSlot";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useIsAdmin } from "@/hooks/useIsAdmin";

/** Which menu item the address belongs to. */
const sectionOf = (pathname: string) =>
  (Object.keys(ADMIN_PATHS) as Section[]).find((key) => pathname.startsWith(ADMIN_PATHS[key])) ?? "conversations";

/** The admin shell, kept across the admin pages: the access check, the sidebar and the page title. */
export function AdminDashboard({ children }: { children: ReactNode }) {
  const isAdmin = useIsAdmin();
  const user = useAuthUser();
  const router = useRouter();
  const section = sectionOf(usePathname());

  // Cosmetic only: the Firestore rules and every admin function on the server check the admin claim.
  // Only a signed-out visitor is sent to log in: a signed-in non-admin would land on the guest page with the chat.
  useEffect(() => {
    if (isAdmin === false && !user) router.replace(ROUTES.login);
  }, [isAdmin, user, router]);

  // No admin listener starts until the claim is confirmed, because the sections only mount then.
  if (!isAdmin) {
    return (
      <main className="px-4 py-8 @xl:px-8">
        <p className="text-muted">{isAdmin === false && user ? ADMIN_TEXT.permissionDenied : ADMIN_TEXT.checking}</p>
      </main>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col @3xl:flex-row">
      <AdminSidebar section={section} />
      {/* A container, so each section lays itself out for the width beside the sidebar. */}
      <main className="@container min-w-0 flex-1 px-4 pb-6 @xl:px-8">
        <div className="flex items-center justify-between gap-3 py-4">
          <h1 className="font-serif text-[40px] leading-[1.1] font-medium">{ADMIN_TEXT.sections[section]}</h1>
          <div id={HEADER_SLOT_ID} />
        </div>
        {children}
      </main>
    </div>
  );
}
