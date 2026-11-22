import type { CONCIERGE } from "@/content/home";

export type ConciergeItem = (typeof CONCIERGE)[number];
export type ConciergeCardProps = { item: ConciergeItem };
