import { API_URL } from "@/config/env";
import { GENERIC_ERROR, MISSING_API_URL, NO_CONNECTION } from "@/content/auth";
import { auth } from "@/lib/firebase";
import { ServerError } from "@/utils/auth-errors";

export type RegisterDetails = { name: string; phone: string; email: string; password: string };

/** Sends JSON to the server. Any failure is thrown as a ServerError with a message fit to show. */
export async function post<T = void>(path: string, body: unknown, token?: string): Promise<T> {
  // Without this check a missing setting would send the request to the page's own address.
  if (!API_URL) throw new ServerError(MISSING_API_URL);
  let response: Response;
  try {
    response = await fetch(`${API_URL}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ServerError(NO_CONNECTION);
  }
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new ServerError(error?.error ?? GENERIC_ERROR);
  }
  return response.json().catch(() => null) as Promise<T>;
}

export async function idToken() {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new ServerError(GENERIC_ERROR);
  return token;
}

// The server checks the details, creates the account and saves the profile.
export const register = (details: RegisterDetails) => post("register", details);

// The server checks the login token, saves the text as a new message and queues Xenia's answer.
export async function sendMessage(text: string) {
  await post("send_message", { text }, await idToken());
}
