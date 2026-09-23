import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const COOKIE = "sm_session";
const MAX_AGE = 10 * 60;
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-only-change-me");

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  nik: string | null;
  birthDate: Date | null;
};

export async function createSession(userId: number) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret);

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function refreshSession(userId: number) {
  return createSession(userId);
}

export async function destroySession() {
  const store = await cookies();
  store.set(COOKIE, "", { httpOnly: true, expires: new Date(0), path: "/" });
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    const userId = Number(payload.userId);
    if (!Number.isInteger(userId)) return null;

    return await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, nik: true, birthDate: true },
    });
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}