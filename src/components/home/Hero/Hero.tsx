import { ChatCta } from "@/components/chat/ChatCta";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import { HERO_IMAGE, SECTION_IDS } from "@/constants";
import { HERO } from "@/content/home";
import { SITE } from "@/content/site";
import { ctaOutlineClass, ctaPrimaryClass } from "@/styles/classes";
import { badgeClass, photoClass, titleClass } from "./Hero.styles";

export function Hero() {
  return (
    <section className="grid items-center gap-8 pt-4 @xl:pt-8 @4xl:grid-cols-2 @4xl:gap-14">
      <div>
        <p className={badgeClass}>
          <Icon size={14} strokeWidth={2.2}>
            <path d="M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21z" />
            <circle cx="12" cy="9.5" r="2.5" />
          </Icon>
          {SITE.location}
        </p>
        <h1 className={titleClass}>{HERO.title}</h1>
        <p className="mt-5 max-w-[46ch] text-lg text-muted">{HERO.intro}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <ChatCta className={ctaPrimaryClass}>{HERO.chatCta}</ChatCta>
          <a href={`#${SECTION_IDS.rooms}`} className={ctaOutlineClass}>
            {HERO.roomsCta}
          </a>
        </div>
      </div>
      <Photo {...HERO_IMAGE} priority sizes="(min-width: 1024px) 50vw, 100vw" className={photoClass} />
    </section>
  );
}
