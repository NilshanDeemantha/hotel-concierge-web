import { eyebrowClass, sectionTitleClass } from "@/styles/classes";
import type { SectionHeaderProps } from "./SectionHeader.types";

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className={`${eyebrowClass} text-brand`}>{eyebrow}</p>
        <h2 className={sectionTitleClass}>{title}</h2>
      </div>
      <p className="max-w-[40ch] text-muted">{description}</p>
    </div>
  );
}
