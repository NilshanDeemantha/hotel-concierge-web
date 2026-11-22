import type { IconProps } from "./Icon.types";

/** A 24x24 line icon: pass the paths as children. */
export function Icon({
  size = 20,
  strokeWidth = 2,
  stroke = "currentColor",
  className,
  roundJoin = true,
  children,
}: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin={roundJoin ? "round" : undefined}
      className={className}
    >
      {children}
    </svg>
  );
}
