import { NextResponse } from "next/server";
import { requireSameOrigin } from "@/lib/csrf";
import { getCurrentUser, refreshSession } from "@/lib/auth";

export async function POST() {
  try { requireSameOrigin(request); } catch { return NextResponse.json({ ok: false }, { status: 403 }); }

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  await refreshSession(user.id);
  return NextResponse.json({ ok: true });
}
