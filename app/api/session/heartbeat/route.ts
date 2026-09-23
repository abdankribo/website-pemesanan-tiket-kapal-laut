import { NextResponse } from "next/server";
import { getCurrentUser, refreshSession } from "@/lib/auth";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  await refreshSession(user.id);
  return NextResponse.json({ ok: true });
}
