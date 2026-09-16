/**
 * Server-side authentication.
 *
 * For this dummy build the user directory is an in-memory list with plain-text
 * demo passwords. Sessions are a small HMAC-signed JSON cookie so they can't be
 * tampered with on the client. In production you would swap USERS for a database
 * table with hashed passwords — nothing else in the app would need to change.
 */
import { cookies } from "next/headers";
import crypto from "crypto";
import { permissionsFor, type Role, type SessionUser } from "@/lib/roles";

export * from "@/lib/roles";

export const SESSION_COOKIE = "slb_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours
const SECRET = process.env.AUTH_SECRET ?? "sri-lanka-balloon-dev-secret-change-me";

/** Demo directory — username, plain demo password, display name, role. */
interface DirectoryUser {
  username: string;
  password: string;
  name: string;
  role: Role;
}

export const USERS: DirectoryUser[] = [
  { username: "admin", password: "balloon123", name: "M.Uluer", role: "admin" },
  { username: "ops", password: "balloon123", name: "Nuwan Perera", role: "ops" },
  { username: "desk", password: "balloon123", name: "Sanduni Fernando", role: "reservations" },
  { username: "accounts", password: "balloon123", name: "Rajiv Mendis", role: "accountant" },
  { username: "pilot", password: "balloon123", name: "Capt. David Hughes", role: "pilot" },
  { username: "viewer", password: "balloon123", name: "Guest Viewer", role: "viewer" },
];

function sign(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export function createSessionToken(user: SessionUser): string {
  const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): SessionUser | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (parsed && typeof parsed.username === "string" && typeof parsed.role === "string") {
      return parsed as SessionUser;
    }
    return null;
  } catch {
    return null;
  }
}

/** Validate demo credentials and return a safe session user. */
export function authenticate(username: string, password: string): SessionUser | null {
  const uname = username.trim().toLowerCase();
  if (!uname || !password) return null;
  const user = USERS.find((u) => u.username === uname && u.password === password);
  if (!user) return null;
  return { username: user.username, name: user.name, role: user.role };
}

/** Read and verify the current session from request cookies (server only). */
export function getSession(): SessionUser | null {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

/** Convenience guard for API route handlers / server components. */
export function can(
  user: SessionUser | null,
  permission: keyof ReturnType<typeof permissionsFor>,
): boolean {
  if (!user) return false;
  return permissionsFor(user.role)[permission];
}
