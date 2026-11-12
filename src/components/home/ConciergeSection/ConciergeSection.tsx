import { ChatCta } from "@/components/chat/ChatCta";
import { SECTION_IDS } from "@/constants";
import { CONCIERGE, CONCIERGE_SECTION } from "@/content/home";
import { ctaLightClass, eyebrowClass, sectionTitleClass } from "@/styles/classes";
import { ConciergeCard } from "./ConciergeCard";
import { sectionClass } from "./ConciergeSection.styles";

export function ConciergeSection() {
  return (
    <section id={SECTION_IDS.concierge} className={sectionClass}>
      <p className={`${eyebrowClass} text-[#BFE3DD]`}>{CONCIERGE_SECTION.eyebrow}</p>
      <h2 className={`${sectionTitleClass} max-w-[20ch]`}>{CONCIERGE_SECTION.title}</h2>
      <ul className="mt-8 grid gap-5 @3xl:grid-cols-3">
        {CONCIERGE.map((item) => (
          <ConciergeCard key={item.title} item={item} />
        ))}
      </ul>
      <ChatCta className={`mt-7 ${ctaLightClass}`}>{CONCIERGE_SECTION.chatCta}</ChatCta>
    </section>
  );
}
