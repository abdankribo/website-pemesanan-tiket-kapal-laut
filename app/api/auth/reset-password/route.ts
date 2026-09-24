import { NextResponse } from "next/server";
import { requireSameOrigin } from "@/lib/csrf";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request:Request) {
  try { requireSameOrigin(request); } catch { return NextResponse.redirect(new URL("/login?error=reset_invalid",request.url)); }

  let form: FormData;
  try { form = await request.formData(); } catch { return NextResponse.redirect(new URL("/login?error=reset_invalid",request.url)); }
  const email=String(form.get("email")||"").trim().toLowerCase();
  const raw=String(form.get("token")||"");
  const password=String(form.get("password")||"");
  const confirmation=String(form.get("password_confirmation")||"");
  if(!email || !raw || password.length<8 || password.length>128 || password!==confirmation) return NextResponse.redirect(new URL("/login?error=reset_invalid",request.url));
  if(!(await checkRateLimit(request, "reset-password", email, 10, 60 * 60 * 1000))) return NextResponse.redirect(new URL("/login?error=reset_invalid",request.url));

  const token=crypto.createHash("sha256").update(raw).digest("hex");
  const record=await prisma.passwordResetToken.findUnique({where:{email}});
  if(!record || record.token!==token || !record.expiresAt || record.expiresAt<new Date()) return NextResponse.redirect(new URL("/login?error=reset_invalid",request.url));

  try {
    await prisma.$transaction([
      prisma.user.update({where:{email},data:{password:await bcrypt.hash(password,12)}}),
      prisma.passwordResetToken.delete({where:{email}})
    ]);
  } catch {
    return NextResponse.redirect(new URL("/login?error=reset_invalid",request.url));
  }
  return NextResponse.redirect(new URL("/login?status=password_reset",request.url));
}
