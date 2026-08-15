import { auth } from "@/src/auth";

export async function authHeader(): Promise<Record<string, string>> {
  const session = await auth();
  return session?.access_token
    ? { Authorization: `Bearer ${session.access_token}` }
    : {};
}
