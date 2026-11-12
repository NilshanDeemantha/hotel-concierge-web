import Image from "next/image";
import type { PhotoProps } from "./Photo.types";

/** An image that fills its frame. */
export function Photo({ src, alt, sizes, priority, className, children }: PhotoProps) {
  return (
    <div className={className}>
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      {children}
    </div>
  );
}
