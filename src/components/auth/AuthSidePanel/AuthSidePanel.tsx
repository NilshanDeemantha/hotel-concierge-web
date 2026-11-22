import { Photo } from "@/components/ui/Photo";
import { HERO_IMAGE } from "@/constants";
import { AUTH_TEXT } from "@/content/auth";
import { SITE } from "@/content/site";
import { eyebrowClass } from "@/styles/classes";

/** The photo beside the form, shown on wide screens. */
export function AuthSidePanel() {
  return (
    <Photo
      {...HERO_IMAGE}
      priority
      sizes="50vw"
      className="relative hidden min-h-[640px] overflow-hidden rounded-[28px] @4xl:block"
    >
      <div className="absolute bottom-6 left-6 max-w-[380px] rounded-[20px] bg-bg p-7">
        <p className={`${eyebrowClass} text-brand`}>{SITE.location}</p>
        <p className="mt-2.5 font-serif text-[32px] leading-[1.1] font-medium">{AUTH_TEXT.sideTitle}</p>
      </div>
    </Photo>
  );
}
