import type { ReactNode } from "react";

export type MediaCardProps = {
  id?: string;
  /** Classes added to the card, before the shared card look. */
  className?: string;
  image: { src: string; alt: string; sizes: string };
  imageClassName: string;
  bodyClassName: string;
  children: ReactNode;
};
