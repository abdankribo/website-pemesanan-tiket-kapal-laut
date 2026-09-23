import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireSameOrigin } from "@/lib/csrf";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const METHODS = new Set(["mandiri", "bca", "gopay"]);

export async function POST(request: Request) {
  try { requireSameOrigin(request); } catch { return NextResponse.redirect(new URL("/payment?error=invalid", request.url)); }

  const user = await getCurrentUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  let form: FormData;
  try { form = await request.formData(); } catch { return NextResponse.redirect(new URL("/payment?error=invalid", request.url)); }
  const method = String(form.get("payment_method") || "");
  const draftId = String(form.get("draft_id") || "");

  if (!METHODS.has(method) || !draftId) {
    return NextResponse.redirect(new URL("/booking?error=Data%20pembayaran%20tidak%20valid", request.url));
  }

  const draft = await prisma.bookingDraft.findFirst({
    where: { id: draftId, userId: user.id, expiresAt: { gt: new Date() } },
  });

  if (!draft) {
    return NextResponse.redirect(new URL("/booking?error=Booking%20sudah%20kedaluwarsa", request.url));
  }

  const p = draft.payload as Record<string, unknown>;
  const departureDate = String(p.departureDate || "");
  const departure = new Date(departureDate + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (Number.isNaN(departure.getTime()) || departure < today) {
    return NextResponse.redirect(new URL("/booking?error=Tanggal%20keberangkatan%20tidak%20valid", request.url));
  }

  try {
    const ticket = await prisma.$transaction(async (tx) => {
      const claimed = await tx.bookingDraft.deleteMany({
        where: { id: draft.id, userId: user.id, expiresAt: { gt: new Date() } },
      });
      if (claimed.count !== 1) throw new Error("DRAFT_ALREADY_CONSUMED");
      const lockedDraft = draft;

      const payload = lockedDraft.payload as Record<string, unknown>;
      const created = await tx.ticket.create({
        data: {
          userId: user.id,
          ticketId: randomUUID(),
          passengerName: String(payload.passengerName),
          passengerNik: String(payload.passengerNik),
          passengerPhone: String(payload.passengerPhone),
          origin: String(payload.origin),
          destination: String(payload.destination),
          departureDate: new Date(String(payload.departureDate) + "T00:00:00"),
          vehicle: String(payload.vehicle),
          vehiclePlate: payload.vehiclePlate ? String(payload.vehiclePlate) : null,
          status: "booked",
        },
      });

      return created;
    });

    return NextResponse.redirect(new URL("/ticket?ticket=" + ticket.ticketId, request.url));
  } catch {
    return NextResponse.redirect(new URL("/payment?draft=" + encodeURIComponent(draft.id) + "&error=payment", request.url));
  }
}
