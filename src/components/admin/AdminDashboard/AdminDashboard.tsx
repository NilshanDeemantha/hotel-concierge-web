"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarTab } from "@/components/admin/CalendarTab";
import { ConversationsTab } from "@/components/admin/ConversationsTab";
import { RoomsTab } from "@/components/admin/RoomsTab";
import { ROUTES } from "@/constants";
import { ADMIN_TEXT } from "@/content/admin";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const TABS = { conversations: ConversationsTab, rooms: RoomsTab, calendar: CalendarTab };
type Tab = keyof typeof TABS;

export function AdminDashboard() {
  const isAdmin = useIsAdmin();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("conversations");

  // Cosmetic only: every admin function on the server checks the admin claim itself.
  useEffect(() => {
    if (isAdmin === false) router.replace(ROUTES.login);
  }, [isAdmin, router]);

  // No admin data is requested until the claim is confirmed, because the tabs only mount then.
  if (!isAdmin) {
    return (
      <main className="flex-1 px-4 py-8 @xl:px-8">
        <p className="text-muted">{ADMIN_TEXT.checking}</p>
      </main>
    );
  }

  const Panel = TABS[tab];
  return (
    <main className="flex-1 px-4 pb-10 @xl:px-8 @4xl:px-12">
      <h1 className="py-6 font-serif text-[40px] leading-[1.1] font-medium">{ADMIN_TEXT.title}</h1>
      <div role="tablist" aria-label={ADMIN_TEXT.tabsLabel} className="flex gap-2 border-b border-line">
        {(Object.keys(TABS) as Tab[]).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`admin-tab-${key}`}
            aria-selected={tab === key}
            aria-controls="admin-panel"
            className={`-mb-px min-h-11 border-b-2 px-4 font-semibold ${
              tab === key ? "border-brand text-brand" : "border-transparent text-muted"
            }`}
            onClick={() => setTab(key)}
          >
            {ADMIN_TEXT.tabs[key]}
          </button>
        ))}
      </div>
      <div role="tabpanel" id="admin-panel" aria-labelledby={`admin-tab-${tab}`} className="pt-6">
        <Panel />
      </div>
    </main>
  );
}
