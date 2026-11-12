import type { ReactNode } from "react";

export type IconProps = {
  size?: number;
  strokeWidth?: number;
  stroke?: string;
  className?: string;
  /** Round line joins. Off only where the original icon had none. */
  roundJoin?: boolean;
  children: ReactNode;
};
