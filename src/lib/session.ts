import "server-only";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "cwk_sid";

// The root middleware guarantees this cookie is set before any Server
// Component runs; the random fallback only covers edge cases (e.g. a route
// handler invoked in isolation during tests).
export async function getSessionId(): Promise<string> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? crypto.randomUUID();
}
