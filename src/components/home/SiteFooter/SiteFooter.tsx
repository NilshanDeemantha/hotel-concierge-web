import { FOOTER } from "@/content/home";
import { CONTACT, SITE } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-18 grid gap-8 border-t border-line pt-7 pb-10 @3xl:grid-cols-3">
      <div>
        <p className="font-serif text-xl font-semibold text-brand">{SITE.name}</p>
        <p className="mt-1 text-sm text-muted">{SITE.location}</p>
        <p className="mt-1 text-sm text-muted">{FOOTER.copyright}</p>
      </div>
      <div className="text-sm text-muted">
        <p className="font-semibold text-ink">{FOOTER.contactTitle}</p>
        <p className="mt-1">{CONTACT.addressLines.join(", ")}</p>
        <p className="mt-1">
          <a href={CONTACT.phoneHref} className="hover:underline">
            {CONTACT.phone}
          </a>
        </p>
        <p className="mt-1">
          <a href={CONTACT.emailHref} className="hover:underline">
            {CONTACT.email}
          </a>
        </p>
      </div>
      <p className="max-w-[44ch] text-sm text-muted @3xl:justify-self-end">{FOOTER.disclaimer}</p>
    </footer>
  );
}
