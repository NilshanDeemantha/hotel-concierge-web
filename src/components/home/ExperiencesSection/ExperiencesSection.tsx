import { SectionHeader } from "@/components/ui/SectionHeader";
import { SECTION_IDS } from "@/constants";
import { EXPERIENCES, EXPERIENCES_SECTION } from "@/content/home";
import { ExperienceCard } from "./ExperienceCard";

export function ExperiencesSection() {
  return (
    <section id={SECTION_IDS.experiences} className="mt-18 scroll-mt-6">
      <SectionHeader {...EXPERIENCES_SECTION} />
      <ul className="mt-7 grid gap-5 @xl:grid-cols-2 @4xl:grid-cols-4">
        {EXPERIENCES.map((item) => (
          <ExperienceCard key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
