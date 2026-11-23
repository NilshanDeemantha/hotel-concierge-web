"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ComponentType } from "react";
import { AdminSidebar, type Section } from "@/components/admin/AdminSidebar";
import { CalendarTab } from "@/components/admin/CalendarTab";
import { ConversationsTab } from "@/components/admin/ConversationsTab";
import { RoomsTab } from "@/components/admin/RoomsTab";
import { ROUTES } from "@/constants";
import { ADMIN_TEXT } from "@/content/admin";
import { useIsAdmin } from "@/hooks/useIsAdmin";

// A new section is one entry here plus its label in ADMIN_TEXT.sections.
const SECTIONS: Record<Section, ComponentType> = {
  conversations: ConversationsTab,
  rooms: RoomsTab,
  calendar: CalendarTab,
};

export function AdminDashboard() {
  const isAdmin = useIsAdmin();
  const router = useRouter();
  const [section, setSection] = useState<Section>("conversations");

  // Cosmetic only: the Firestore rules and every admin function on the server check the admin claim.
  useEffect(() => {
    if (isAdmin === false) router.replace(ROUTES.login);
  }, [isAdmin, router]);

  // No admin listener starts until the claim is confirmed, because the sections only mount then.
  if (!isAdmin) {
    return (
      <main className="px-4 py-8 @xl:px-8">
        <p className="text-muted">{ADMIN_TEXT.checking}</p>
      </main>
    );
  }

  const Panel = SECTIONS[section];
  return (
    <div className="flex min-h-dvh flex-col @3xl:flex-row">
      <AdminSidebar section={section} onSelect={setSection} />
      {/* A container, so each section lays itself out for the width beside the sidebar. */}
      <main className="@container min-w-0 flex-1 px-4 pb-10 @xl:px-8">
        <h1 className="py-6 font-serif text-[40px] leading-[1.1] font-medium">{ADMIN_TEXT.sections[section]}</h1>
        <Panel />
      </main>
    </div>
  );
}
