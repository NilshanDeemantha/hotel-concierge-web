"use client";

import { useState } from "react";
import { Photo } from "@/components/ui/Photo";
import { ROOMS_TEXT } from "@/content/admin";

/** One large photo with a strip of small ones under it. Choosing a small one shows it large. */
export function RoomGallery({ photos }: { photos: string[] }) {
  const [chosen, setChosen] = useState(0);
  if (photos.length === 0) return null;
  const current = Math.min(chosen, photos.length - 1);

  return (
    <div className="flex flex-col gap-1.5">
      <Photo
        src={photos[current]}
        alt={ROOMS_TEXT.photoAlt(current + 1)}
        sizes="(min-width: 768px) 400px, 100vw"
        className="relative aspect-[16/9] overflow-hidden rounded-lg bg-line"
      />
      {photos.length > 1 && (
        <ul aria-label={ROOMS_TEXT.photosLabel} className="flex gap-1 overflow-x-auto pb-1">
          {photos.map((url, i) => (
            <li key={url} className="shrink-0">
              <button
                type="button"
                aria-label={ROOMS_TEXT.showPhoto(i + 1)}
                aria-current={i === current}
                className={`relative block size-9 overflow-hidden rounded-md ring-2 ${i === current ? "ring-brand" : "opacity-70 ring-transparent hover:opacity-100"}`}
                onClick={() => setChosen(i)}
              >
                <Photo src={url} alt="" sizes="36px" className="absolute inset-0" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
