import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "cbiux_admin";

export function adminPassword() {
  return process.env.ADMIN_PASSWORD ?? (process.env.NODE_ENV !== "production" ? "cbiux" : "");
}

function tokenFor(password: string) {
  return createHmac("sha256", password).update("cbiux-admin-session").digest("hex");
}

export async function isAdmin() {
  const password = adminPassword();
  if (!password) return false;
  const jar = await cookies();
  const value = jar.get(COOKIE)?.value;
  if (!value) return false;
  const expected = tokenFor(password);
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function setAdminCookie() {
  const password = adminPassword();
  const jar = await cookies();
  jar.set(COOKIE, tokenFor(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
