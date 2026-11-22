import { SectionHeader } from "@/components/ui/SectionHeader";
import { SECTION_IDS } from "@/constants";
import { CONTACT_SECTION, GETTING_HERE } from "@/content/home";
import { CONTACT } from "@/content/site";
import { ctaOutlineClass } from "@/styles/classes";
import { ContactCard } from "./ContactCard";
import { cardClass, linkClass } from "./ContactSection.styles";

const ICONS = {
  address: "M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  email: "M3 6h18v12H3zM3 7l9 6 9-6",
  times: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
} as const;

export function ContactSection() {
  const c = CONTACT_SECTION;
  return (
    <section id={SECTION_IDS.contact} className="mt-18 scroll-mt-6">
      <SectionHeader eyebrow={c.eyebrow} title={c.title} description={c.description} />
      <ul className="mt-7 grid gap-5 @xl:grid-cols-2 @5xl:grid-cols-4">
        <ContactCard icon={ICONS.address} label={c.addressLabel}>
          {CONTACT.addressLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </ContactCard>
        <ContactCard icon={ICONS.phone} label={c.phoneLabel}>
          <a href={CONTACT.phoneHref} className={linkClass}>
            {CONTACT.phone}
          </a>
        </ContactCard>
        <ContactCard icon={ICONS.email} label={c.emailLabel}>
          <a href={CONTACT.emailHref} className={`${linkClass} break-words`}>
            {CONTACT.email}
          </a>
        </ContactCard>
        <ContactCard icon={ICONS.times} label={c.timesLabel}>
          <p>
            {c.checkInLabel}: {CONTACT.checkIn}
          </p>
          <p>
            {c.checkOutLabel}: {CONTACT.checkOut}
          </p>
          <p>
            {c.receptionLabel}: {CONTACT.reception}
          </p>
        </ContactCard>
      </ul>

      <div className={`${cardClass} mt-5 flex flex-wrap items-center justify-between gap-5`}>
        <div>
          <h3 className="font-serif text-[22px] font-semibold">{c.gettingHereTitle}</h3>
          <ul className="mt-2 space-y-1 text-[15px]">
            {GETTING_HERE.map((item) => (
              <li key={item.place}>
                <span className="font-semibold">{item.place}:</span> <span className="text-muted">{item.how}</span>
              </li>
            ))}
          </ul>
        </div>
        <a href={CONTACT.mapsHref} target="_blank" rel="noopener noreferrer" className={ctaOutlineClass}>
          {c.directionsCta}
        </a>
      </div>
      <p className="mt-3 text-[13px] text-muted">{c.demoNote}</p>
    </section>
  );
}
