import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";

function redirect(request:Request, query="sent=1") { return NextResponse.redirect(new URL("/forgot-password?"+query, request.url)); }

export async function POST(request:Request) {
  const form=await request.formData();
  const email=String(form.get("email")||"").trim().toLowerCase();
  if(!/^\S+@\S+\.\S+$/.test(email)) return redirect(request);

  const user=await prisma.user.findUnique({where:{email}});
  if(!user) return redirect(request);

  const raw=crypto.randomBytes(32).toString("hex");
  const token=crypto.createHash("sha256").update(raw).digest("hex");
  const expiresAt=new Date(Date.now()+60*60*1000);
  await prisma.passwordResetToken.upsert({
    where:{email},
    create:{email,token,expiresAt},
    update:{token,expiresAt,createdAt:new Date()}
  });

  const base=(process.env.NEXT_PUBLIC_APP_URL||new URL(request.url).origin).replace(/\/$/,"");
  const resetUrl=`${base}/reset-password?token=${raw}&email=${encodeURIComponent(email)}`;
  const resendKey = process.env.RESEND_API_KEY;
  const sender = process.env.RESEND_FROM_EMAIL || process.env.MAIL_FROM;
  if (resendKey && sender) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: sender, to: [email], subject: "Reset Password Surabaya-Madura", html: `<p>Gunakan link berikut untuk mengubah password Anda:</p><p><a href="${resetUrl}">Reset Password</a></p><p>Link berlaku 1 jam.</p>` }),
      });
      if (!response.ok) console.error("Password reset email failed:", await response.text());
    } catch (error) {
      console.error("Password reset email request failed:", error);
    }
  }
  return redirect(request);
}
