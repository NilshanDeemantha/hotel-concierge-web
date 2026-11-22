import type { ReactNode } from "react";

export type PhotoProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** Classes for the frame: it must set the size (and is `relative`). */
  className?: string;
  /** Rendered over the image. */
  children?: ReactNode;
};
