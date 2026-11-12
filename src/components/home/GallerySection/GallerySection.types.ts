import type { GALLERY } from "@/content/home";

export type GalleryPhoto = (typeof GALLERY)[number];
export type GallerySliderProps = { photos: readonly GalleryPhoto[] };
