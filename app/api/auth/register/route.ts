import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { requireSameOrigin } from "@/lib/csrf";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { Prisma } from "@/generated/prisma";

export async function POST(request: Request) {
  try { requireSameOrigin(request); } catch { return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 403 }); }

  const isJson = request.headers.get("content-type")?.includes("application/json");
  let body: Record<string, unknown>;
  try {
    body = isJson ? await request.json() : Object.fromEntries(await request.formData());
  } catch {
    return isJson
      ? NextResponse.json({ error: "Payload tidak valid." }, { status: 400 })
      : NextResponse.redirect(new URL("/register?error=Permintaan%20tidak%20valid", request.url));
  }
  const name = String(body.name || "").trim();
  if (!(await checkRateLimit(request, "register", String(body.email || "anonymous"), 5, 60 * 60 * 1000))) {
    return isJson ? NextResponse.json({ error: "Terlalu banyak percobaan pendaftaran. Coba lagi nanti." }, { status: 429 }) : NextResponse.redirect(new URL("/register?error=Terlalu%20banyak%20percobaan", request.url));
  }
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (name.length > 100 || email.length > 254 || !name || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || password.length > 128) {
    if (isJson) return NextResponse.json({ error: "Data pendaftaran tidak valid." }, { status: 400 });
    return NextResponse.redirect(new URL("/register?error=Data%20pendaftaran%20tidak%20valid", request.url));
  }

  const exists = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (exists) {
    if (isJson) return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 409 });
    return NextResponse.redirect(new URL("/login?error=Akun%20sudah%20terdaftar", request.url));
  }

  let user;
  try {
    user = await prisma.user.create({
      data: { name, email, password: await hash(password, 12) },
      select: { id: true },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      if (isJson) return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 409 });
      return NextResponse.redirect(new URL("/login?error=Akun%20sudah%20terdaftar", request.url));
    }
    throw error;
  }

  await createSession(user.id);
  if (isJson) return NextResponse.json({ ok: true });
  return NextResponse.redirect(new URL("/booking", request.url));
}
