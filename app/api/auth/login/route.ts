import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { requireSameOrigin } from "@/lib/csrf";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try { requireSameOrigin(request); } catch { return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 403 }); }

  const isJson = request.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await request.json() : Object.fromEntries(await request.formData());
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (email.length > 254 || password.length > 128) return isJson ? NextResponse.json({ error: "Email atau password salah." }, { status: 401 }) : NextResponse.redirect(new URL("/login?error=Email%20atau%20password%20salah", request.url));

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.password || !(await compare(password, user.password))) {
    if (isJson) return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
    return NextResponse.redirect(new URL("/login?error=Email%20atau%20password%20salah", request.url));
  }

  await createSession(user.id);
  if (isJson) return NextResponse.json({ ok: true });
  return NextResponse.redirect(new URL("/booking", request.url));
}
