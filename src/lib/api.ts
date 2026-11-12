import { API_URL } from "@/config/env";
import { GENERIC_ERROR, MISSING_API_URL, NO_CONNECTION } from "@/content/auth";
import { ServerError } from "@/utils/auth-errors";

export type RegisterDetails = { name: string; phone: string; email: string; password: string };

// The server checks the details, creates the account and saves the profile.
export async function register(details: RegisterDetails) {
  // Without this check a missing setting would send the request to the page's own address.
  if (!API_URL) throw new ServerError(MISSING_API_URL);
  let response: Response;
  try {
    response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });
  } catch {
    throw new ServerError(NO_CONNECTION);
  }
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ServerError(body?.error ?? GENERIC_ERROR);
  }
}
