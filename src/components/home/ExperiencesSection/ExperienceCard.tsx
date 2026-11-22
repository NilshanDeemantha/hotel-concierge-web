import { Icon } from "@/components/ui/Icon";
import { cardClass } from "./ExperiencesSection.styles";
import type { ExperienceCardProps } from "./ExperienceCard.types";

export function ExperienceCard({ item }: ExperienceCardProps) {
  return (
    <li id={item.id} className={cardClass}>
      <Icon size={28} strokeWidth={1.8} className="text-brand">
        <path d={item.icon} />
      </Icon>
      <h3 className="mt-3.5 font-serif text-[22px] font-semibold">{item.title}</h3>
      <p className="mt-1.5 text-[15px] text-muted">{item.text}</p>
    </li>
  );
}
