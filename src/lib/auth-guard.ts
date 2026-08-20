import { headers } from "next/headers";
import { auth, type User } from "./auth";

export class AuthError extends Error {}

export async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new AuthError("You must be signed in to do this.");
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireSession();
  const user = session.user as User;
  if (user.role !== "ADMIN") {
    throw new AuthError("You don't have permission to do this.");
  }
  return session;
}
