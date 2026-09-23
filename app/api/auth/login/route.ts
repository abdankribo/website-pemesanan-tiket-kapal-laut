import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.password || !(await compare(password, user.password))) {
    return NextResponse.redirect(new URL("/login?error=Email%20atau%20password%20salah", request.url));
  }

  await createSession(user.id);
  return NextResponse.redirect(new URL("/", request.url));
}
