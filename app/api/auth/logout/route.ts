import { NextResponse } from "next/server";
import { requireSameOrigin } from "@/lib/csrf";
import { destroySession } from "@/lib/auth";

export async function POST(request: Request) {
  try { requireSameOrigin(request); } catch { return NextResponse.redirect(new URL("/", request.url)); }

  await destroySession();
  return NextResponse.redirect(new URL("/", request.url));
}
