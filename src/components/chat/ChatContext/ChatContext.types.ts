import type { User } from "firebase/auth";

export type ChatState = {
  // undefined = still checking, null = signed out
  user: User | null | undefined;
  open: boolean;
  setOpen: (open: boolean) => void;
};
