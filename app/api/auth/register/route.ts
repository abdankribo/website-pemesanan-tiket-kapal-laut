import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");

  if (!name || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
    return NextResponse.redirect(new URL("/register?error=Data%20pendaftaran%20tidak%20valid", request.url));
  }

  const exists = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (exists) {
    return NextResponse.redirect(new URL("/login?error=Akun%20sudah%20terdaftar", request.url));
  }

  const user = await prisma.user.create({
    data: { name, email, password: await hash(password, 12) },
    select: { id: true },
  });

  await createSession(user.id);
  return NextResponse.redirect(new URL("/", request.url));
}
