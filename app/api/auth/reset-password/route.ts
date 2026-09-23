import { NextResponse } from "next/server";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request:Request) {
  const form=await request.formData();
  const email=String(form.get("email")||"").trim().toLowerCase();
  const raw=String(form.get("token")||"");
  const password=String(form.get("password")||"");
  const confirmation=String(form.get("password_confirmation")||"");
  if(!email || !raw || password.length<8 || password!==confirmation) return NextResponse.redirect(new URL("/login?error=reset_invalid",request.url));

  const token=crypto.createHash("sha256").update(raw).digest("hex");
  const record=await prisma.passwordResetToken.findUnique({where:{email}});
  if(!record || record.token!==token || !record.expiresAt || record.expiresAt<new Date()) return NextResponse.redirect(new URL("/login?error=reset_invalid",request.url));

  await prisma.$transaction([
    prisma.user.update({where:{email},data:{password:await bcrypt.hash(password,12)}}),
    prisma.passwordResetToken.delete({where:{email}})
  ]);
  return NextResponse.redirect(new URL("/login?status=password_reset",request.url));
}
