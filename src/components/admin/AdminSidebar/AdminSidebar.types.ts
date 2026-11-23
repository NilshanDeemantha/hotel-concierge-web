import type { ADMIN_TEXT } from "@/content/admin";

export type Section = keyof typeof ADMIN_TEXT.sections;

export type AdminSidebarProps = {
  section: Section;
  onSelect: (section: Section) => void;
};
