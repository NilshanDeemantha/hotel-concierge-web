import { ConciergeSection } from "@/components/home/ConciergeSection";
import { ContactSection } from "@/components/home/ContactSection";
import { ExperiencesSection } from "@/components/home/ExperiencesSection";
import { GallerySection } from "@/components/home/GallerySection";
import { Hero } from "@/components/home/Hero";
import { RoomsSection } from "@/components/home/RoomsSection";
import { SiteFooter } from "@/components/home/SiteFooter";

export default function Home() {
  return (
    <main className="flex-1 px-4 @xl:px-8 @4xl:px-12">
      <Hero />
      <GallerySection />
      <RoomsSection />
      <ConciergeSection />
      <ExperiencesSection />
      <ContactSection />
      <SiteFooter />
    </main>
  );
}
