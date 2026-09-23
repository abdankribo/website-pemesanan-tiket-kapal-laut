import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { randomBytes } from "crypto";

type GoogleToken = { access_token?: string; id_token?: string };
type GoogleUser = { sub?: string; email?: string; name?: string; email_verified?: boolean };

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const stateCookie = (await cookies()).get("google_oauth_state")?.value;

  if (!code || !state || !stateCookie || state !== stateCookie) {
    return NextResponse.redirect(new URL("/login?error=OAuth%20state%20tidak%20valid", request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return NextResponse.redirect(new URL("/login?error=Google%20OAuth%20belum%20dikonfigurasi", request.url));

  const callback = new URL(process.env.GOOGLE_REDIRECT_URI || "/api/auth/google/callback", request.url);
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code, client_id: clientId, client_secret: clientSecret,
      redirect_uri: callback.toString(), grant_type: "authorization_code",
    }),
  });
  if (!tokenResponse.ok) return NextResponse.redirect(new URL("/login?error=Google%20OAuth%20gagal", request.url));

  const token = (await tokenResponse.json()) as GoogleToken;
  if (!token.access_token) return NextResponse.redirect(new URL("/login?error=Token%20Google%20tidak%20tersedia", request.url));

  const userResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  if (!userResponse.ok) return NextResponse.redirect(new URL("/login?error=Profil%20Google%20tidak%20dapat%20dibaca", request.url));

  const profile = (await userResponse.json()) as GoogleUser;
  const googleId = String(profile.sub || "");
  const email = String(profile.email || "").trim().toLowerCase();
  if (!googleId || !email || profile.email_verified !== true) return NextResponse.redirect(new URL("/login?error=Email%20Google%20tidak%20terverifikasi", request.url));

  let user = await prisma.user.findUnique({ where: { googleId } });
  if (!user) user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: profile.name || "Google User",
        email,
        googleId,
        emailVerifiedAt: new Date(),
        password: randomBytes(32).toString("hex"),
      },
    });
  } else if (!user.googleId) {
    user = await prisma.user.update({ where: { id: user.id }, data: { googleId, emailVerifiedAt: new Date() } });
  }

  await createSession(user.id);
  const response = NextResponse.redirect(new URL("/booking", request.url));
  response.cookies.delete("google_oauth_state");
  return response;
}
