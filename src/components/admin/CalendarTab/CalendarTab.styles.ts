const cellBase = "h-7 min-w-7 border border-line font-bold";

export const cellClass = {
  free: `${cellBase} bg-surface`,
  booked: `${cellBase} bg-brand text-white`,
  blocked: `${cellBase} bg-[repeating-linear-gradient(45deg,#e6dfd3_0_4px,#faf6ef_4px_8px)] text-ink`,
} as const;
