import { FirebaseError } from "firebase/app";
import { AUTH_ERRORS, GENERIC_ERROR } from "@/content/auth";

// An error whose message is already written for the user (it comes from our own server).
export class ServerError extends Error {}

export function errorMessage(error: unknown) {
  if (error instanceof ServerError) return error.message;
  const code = error instanceof FirebaseError ? error.code : "";
  return AUTH_ERRORS[code] ?? GENERIC_ERROR;
}
