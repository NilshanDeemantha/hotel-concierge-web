import { Icon } from "@/components/ui/Icon";
import { cardClass } from "./ContactSection.styles";
import type { ContactCardProps } from "./ContactCard.types";

export function ContactCard({ icon, label, children }: ContactCardProps) {
  return (
    <li className={cardClass}>
      <Icon size={26} strokeWidth={1.8} className="text-brand">
        <path d={icon} />
      </Icon>
      <h3 className="mt-3 text-sm font-bold tracking-widest text-muted uppercase">{label}</h3>
      <div className="mt-1.5 text-[15px] leading-relaxed">{children}</div>
    </li>
  );
}
