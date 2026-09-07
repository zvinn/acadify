import "server-only";

import { cookies } from "next/headers";
import { AUTH_ROLE_COOKIE, AUTH_TOKEN_COOKIE } from "@/lib/auth/constants";

export type AuthRole = "student" | "instructor" | "admin";

export type AuthSession = {
  token: string;
  role: AuthRole;
};

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function getSession(): Promise<AuthSession | null> {
  // Demo mode: bypass auth so CodeCanyon reviewers can explore all pages
  if (process.env.DEMO_MODE === "true") {
    return { token: "demo-token", role: "admin" };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
  const role = cookieStore.get(AUTH_ROLE_COOKIE)?.value;

  if (
    !token ||
    (role !== "student" && role !== "instructor" && role !== "admin")
  ) {
    return null;
  }

  return { token, role };
}

export async function setSession(session: AuthSession) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_TOKEN_COOKIE, session.token, cookieOptions);
  cookieStore.set(AUTH_ROLE_COOKIE, session.role, cookieOptions);
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_TOKEN_COOKIE);
  cookieStore.delete(AUTH_ROLE_COOKIE);
}