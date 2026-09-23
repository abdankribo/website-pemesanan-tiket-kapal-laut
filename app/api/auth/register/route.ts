import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  const isJson = request.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await request.json() : Object.fromEntries(await request.formData());
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!name || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
    if (isJson) return NextResponse.json({ error: "Data pendaftaran tidak valid." }, { status: 400 });
    return NextResponse.redirect(new URL("/register?error=Data%20pendaftaran%20tidak%20valid", request.url));
  }

  const exists = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (exists) {
    if (isJson) return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 409 });
    return NextResponse.redirect(new URL("/login?error=Akun%20sudah%20terdaftar", request.url));
  }

  const user = await prisma.user.create({
    data: { name, email, password: await hash(password, 12) },
    select: { id: true },
  });

  await createSession(user.id);
  if (isJson) return NextResponse.json({ ok: true });
  return NextResponse.redirect(new URL("/booking", request.url));
}
