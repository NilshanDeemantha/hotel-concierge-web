import { Photo } from "@/components/ui/Photo";
import { cardClass } from "./MediaCard.styles";
import type { MediaCardProps } from "./MediaCard.types";

/** A list item with a photo on top and content below. */
export function MediaCard({ id, className, image, imageClassName, bodyClassName, children }: MediaCardProps) {
  return (
    <li id={id} className={`${className} ${cardClass}`}>
      <Photo {...image} className={imageClassName} />
      <div className={bodyClassName}>{children}</div>
    </li>
  );
}
