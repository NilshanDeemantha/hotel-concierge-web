import type { EXPERIENCES } from "@/content/home";

export type Experience = (typeof EXPERIENCES)[number];
export type ExperienceCardProps = { item: Experience };
