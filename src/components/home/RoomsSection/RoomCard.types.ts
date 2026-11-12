import type { ROOMS } from "@/content/home";

export type Room = (typeof ROOMS)[number];
export type RoomCardProps = { room: Room };
