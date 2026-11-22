"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";
import { GALLERY_SECTION } from "@/content/home";
import { settleLoop, stepSlide } from "./gallery.utils";
import { arrowClass, frameClass, slideClass, trackClass } from "./GallerySection.styles";
import type { GallerySliderProps } from "./GallerySection.types";

const SETTLE_MS = 150;

/** A looping slider: swipe or use the arrows, and it also slides on its own. */
export function GallerySlider({ photos }: GallerySliderProps) {
  const track = useRef<HTMLUListElement>(null);
  const paused = useRef(false);
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const count = photos.length;
  const slides = [...photos, photos[0]];

  function step(direction: 1 | -1) {
    if (track.current) stepSlide(track.current, direction, count);
  }

  function handleScroll() {
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => track.current && settleLoop(track.current, count), SETTLE_MS);
  }

  // Slides on its own. Stops while the visitor is pointing at, touching or focused on the
  // slider, and for visitors who reduce motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      if (track.current && !paused.current) stepSlide(track.current, 1, count);
    }, GALLERY_SECTION.autoSlideMs);
    return () => {
      clearInterval(timer);
      clearTimeout(settleTimer.current);
    };
  }, [count]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={GALLERY_SECTION.regionLabel}
      className="relative mt-7"
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
      onTouchStart={() => (paused.current = true)}
      onTouchEnd={() => (paused.current = false)}
    >
      <ul ref={track} className={trackClass} onScroll={handleScroll}>
        {slides.map((photo, i) => (
          <li key={i < count ? photo.src : "loop-copy"} aria-hidden={i >= count || undefined} className={slideClass}>
            <Photo
              src={photo.src}
              alt={photo.alt}
              sizes="(min-width: 1200px) 1100px, 100vw"
              className={frameClass}
            />
          </li>
        ))}
      </ul>
      <button type="button" aria-label={GALLERY_SECTION.previous} className={`${arrowClass} left-3`} onClick={() => step(-1)}>
        <Icon strokeWidth={2.2}>
          <path d="M15 6l-6 6 6 6" />
        </Icon>
      </button>
      <button type="button" aria-label={GALLERY_SECTION.next} className={`${arrowClass} right-3`} onClick={() => step(1)}>
        <Icon strokeWidth={2.2}>
          <path d="M9 6l6 6-6 6" />
        </Icon>
      </button>
    </div>
  );
}
