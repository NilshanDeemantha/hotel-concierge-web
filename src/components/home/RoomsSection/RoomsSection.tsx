import { SectionHeader } from "@/components/ui/SectionHeader";
import { SECTION_IDS } from "@/constants";
import { ROOMS, ROOMS_SECTION } from "@/content/home";
import { RoomCard } from "./RoomCard";

export function RoomsSection() {
  return (
    <section id={SECTION_IDS.rooms} className="mt-18 scroll-mt-6">
      <SectionHeader {...ROOMS_SECTION} />
      <ul className="mt-7 grid gap-5 @3xl:grid-cols-3">
        {ROOMS.map((room) => (
          <RoomCard key={room.name} room={room} />
        ))}
      </ul>
    </section>
  );
}
