import { SectionHeader } from "@/components/ui/SectionHeader";
import { SECTION_IDS } from "@/constants";
import { GALLERY, GALLERY_SECTION } from "@/content/home";
import { GallerySlider } from "./GallerySlider";

export function GallerySection() {
  const { eyebrow, title, description } = GALLERY_SECTION;
  return (
    <section id={SECTION_IDS.gallery} className="mt-18 scroll-mt-6">
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      <GallerySlider photos={GALLERY} />
    </section>
  );
}
