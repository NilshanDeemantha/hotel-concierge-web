import Image from "next/image";
import type { LogoProps } from "./Logo.types";

/** The hotel logo (public/logo.svg). Pass an empty `alt` when the name is written next to it. */
export function Logo({ size, alt, className }: LogoProps) {
  return <Image src="/logo.svg" alt={alt} width={size} height={size} className={className} />;
}
