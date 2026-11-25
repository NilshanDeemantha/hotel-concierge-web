import { redirect } from "next/navigation";
import { ROUTES } from "@/constants";

// /a is the admin area; its pages are /a/conversation and /a/rooms.
export default function Page() {
  redirect(ROUTES.admin);
}
