import { idToken, post } from "@/lib/api";

// Reads come straight from Firestore (src/hooks/admin); only the writes go through the server.
// The models in src/models are what call this.

export async function adminPost<T>(path: string, body: unknown = {}) {
  return post<T>(path, body, await idToken());
}
