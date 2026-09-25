import { NextResponse } from "next/server";
import { requireSameOrigin } from "@/lib/csrf";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  let ticketId = "";
  try {
    const body = await request.json();
    ticketId = String(body?.ticketId || "").trim();
  } catch {
    return NextResponse.json({ error: "Ticket ID tidak valid." }, { status: 400 });
  }

  if (!ticketId) {
    return NextResponse.json({ error: "Ticket ID tidak valid." }, { status: 400 });
  }

  try {
    if (!(await checkRateLimit(request, "ticket-verify", ticketId, 20, 60 * 60 * 1000))) {
      return NextResponse.json({ error: "Terlalu banyak percobaan verifikasi. Coba lagi nanti." }, { status: 429 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { ticketId },
      select: {
        ticketId: true,
        passengerName: true,
        origin: true,
        destination: true,
        departureDate: true,
        vehicle: true,
        vehiclePlate: true,
        status: true,
        scannedAt: true,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Tiket tidak ditemukan." }, { status: 404 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const departure = new Date(ticket.departureDate);
    departure.setHours(0, 0, 0, 0);

    if (departure < today) {
      return NextResponse.json({
        ok: false,
        status: "expired",
        message: "Tiket sudah melewati tanggal keberangkatan.",
        ticket,
      });
    }

    if (ticket.status === "cancelled") {
      return NextResponse.json({
        ok: false,
        status: "cancelled",
        message: "Tiket sudah dibatalkan.",
        ticket,
      });
    }

    if (ticket.status === "scanned") {
      return NextResponse.json({
        ok: true,
        status: "verified",
        alreadyVerified: true,
        message: "Tiket sudah berhasil diverifikasi sebelumnya.",
        ticket,
      });
    }

    const verified = await prisma.ticket.updateMany({
      where: {
        ticketId,
        status: "booked",
      },
      data: {
        status: "scanned",
        scannedAt: new Date(),
      },
    });

    if (verified.count !== 1) {
      const current = await prisma.ticket.findUnique({
        where: { ticketId },
        select: {
          ticketId: true,
          passengerName: true,
          origin: true,
          destination: true,
          departureDate: true,
          vehicle: true,
          vehiclePlate: true,
          status: true,
          scannedAt: true,
        },
      });

      if (current?.status === "scanned") {
        return NextResponse.json({
          ok: true,
          status: "verified",
          alreadyVerified: true,
          message: "Tiket sudah berhasil diverifikasi sebelumnya.",
          ticket: current,
        });
      }

      return NextResponse.json({ error: "Status tiket berubah. Silakan scan ulang." }, { status: 409 });
    }

    const updated = await prisma.ticket.findUnique({
      where: { ticketId },
      select: {
        ticketId: true,
        passengerName: true,
        origin: true,
        destination: true,
        departureDate: true,
        vehicle: true,
        vehiclePlate: true,
        status: true,
        scannedAt: true,
      },
    });

    return NextResponse.json({
      ok: true,
      status: "verified",
      alreadyVerified: false,
      message: "Tiket berhasil diverifikasi.",
      ticket: updated,
    });
  } catch (error) {
    console.error("TICKET_VERIFY_ERROR", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memverifikasi tiket." },
      { status: 500 },
    );
  }
}
