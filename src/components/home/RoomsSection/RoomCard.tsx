import { MediaCard } from "@/components/ui/MediaCard";
import type { RoomCardProps } from "./RoomCard.types";

export function RoomCard({ room }: RoomCardProps) {
  return (
    <MediaCard
      className="flex flex-col"
      image={{ src: room.image, alt: room.alt, sizes: "(min-width: 768px) 33vw, 100vw" }}
      imageClassName="relative h-52"
      bodyClassName="flex flex-1 flex-col p-5"
    >
      <h3 className="font-serif text-[22px] font-semibold">{room.name}</h3>
      <p className="mt-1.5 text-[15px] text-muted">{room.detail}</p>
      <ul className="mt-3.5 flex flex-wrap gap-2 text-[13px] font-medium">
        {room.tags.map((tag) => (
          <li key={tag} className="rounded-full border border-line bg-bg px-2.5 py-1">
            {tag}
          </li>
        ))}
      </ul>
    </MediaCard>
  );
}
