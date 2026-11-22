import { Icon } from "@/components/ui/Icon";
import type { ConciergeCardProps } from "./ConciergeCard.types";

export function ConciergeCard({ item }: ConciergeCardProps) {
  return (
    <li className="rounded-[20px] bg-[#0B4741] p-6">
      <Icon size={28} stroke="#F2B872" strokeWidth={1.8}>
        <path d={item.icon} />
      </Icon>
      <h3 className="mt-3.5 text-lg font-semibold">{item.title}</h3>
      <p className="mt-1.5 text-[15px] text-[#D5EBE7]">{item.text}</p>
    </li>
  );
}
