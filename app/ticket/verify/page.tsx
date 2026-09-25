import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ ticket?: string }> }) {
  const { ticket: ticketId } = await searchParams;
  const cleanTicketId = String(ticketId || "").trim();

  if (!cleanTicketId) {
    return <VerificationError message="QR atau Ticket ID tidak valid." />;
  }

  try {
    const request = new Request("https://ticket-verification.local/ticket/verify", {
      headers: { "x-forwarded-for": "qr-scan" },
    });

    if (!(await checkRateLimit(request, "ticket-verify-page", cleanTicketId, 20, 60 * 60 * 1000))) {
      return <VerificationError message="Terlalu banyak percobaan verifikasi. Coba lagi nanti." />;
    }

    const ticket = await prisma.ticket.findUnique({
      where: { ticketId: cleanTicketId },
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
      return <VerificationError message="Tiket tidak ditemukan." />;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const departure = new Date(ticket.departureDate);
    departure.setHours(0, 0, 0, 0);

    if (departure < today) {
      return <VerificationResult ticket={ticket} title="Tiket Kedaluwarsa" message="Tiket sudah melewati tanggal keberangkatan." tone="error" />;
    }

    if (ticket.status === "cancelled") {
      return <VerificationResult ticket={ticket} title="Tiket Dibatalkan" message="Tiket ini sudah dibatalkan dan tidak dapat digunakan." tone="error" />;
    }

    let verifiedTicket = ticket;
    let alreadyVerified = ticket.status === "scanned";

    if (!alreadyVerified) {
      const result = await prisma.ticket.updateMany({
        where: { ticketId: cleanTicketId, status: "booked" },
        data: { status: "scanned", scannedAt: new Date() },
      });

      if (result.count === 1) {
        const updated = await prisma.ticket.findUnique({
          where: { ticketId: cleanTicketId },
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
        if (updated) verifiedTicket = updated;
      } else {
        const current = await prisma.ticket.findUnique({
          where: { ticketId: cleanTicketId },
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
        if (!current || current.status !== "scanned") {
          return <VerificationError message="Status tiket berubah. Silakan scan ulang." />;
        }
        verifiedTicket = current;
        alreadyVerified = true;
      }
    }

    return (
      <VerificationResult
        ticket={verifiedTicket}
        title="Tiket Berhasil Diverifikasi"
        message={
          alreadyVerified
            ? "Tiket ini sudah berhasil diverifikasi sebelumnya."
            : "Tiket berhasil diverifikasi dan dipindahkan ke Riwayat Pesanan."
        }
        tone="success"
      />
    );
  } catch (error) {
    console.error("TICKET_VERIFY_PAGE_ERROR", error);
    return <VerificationError message="Terjadi kesalahan saat memverifikasi tiket. Silakan coba scan ulang." />;
  }
}

type Ticket = {
  ticketId: string;
  passengerName: string;
  origin: string;
  destination: string;
  departureDate: Date;
  vehicle: string | null;
  vehiclePlate: string | null;
  status: string;
  scannedAt: Date | null;
};

function VerificationResult({
  ticket,
  title,
  message,
  tone,
}: {
  ticket: Ticket;
  title: string;
  message: string;
  tone: "success" | "error";
}) {
  const success = tone === "success";

  return (
    <main className="min-h-screen bg-surface px-4 py-12">
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-sm">
        <div className={success ? "rounded-2xl bg-green-50 p-6" : "rounded-2xl bg-red-50 p-6"}>
          <p className={success ? "text-xs font-black uppercase tracking-[.3em] text-green-600" : "text-xs font-black uppercase tracking-[.3em] text-red-600"}>
            Ticket Verification
          </p>
          <h1 className={success ? "mt-2 text-3xl font-black text-green-700" : "mt-2 text-3xl font-black text-red-700"}>
            {title}
          </h1>
          <p className="mt-3 text-sm text-slate-600">{message}</p>
        </div>

        <div className="mt-6 space-y-3 text-sm">
          <p><b>Passenger:</b> {ticket.passengerName}</p>
          <p><b>Route:</b> {ticket.origin} → {ticket.destination}</p>
          <p><b>Departure:</b> {ticket.departureDate.toLocaleDateString("id-ID")}</p>
          <p><b>Vehicle:</b> {ticket.vehiclePlate || ticket.vehicle || "Passenger"}</p>
          <p><b>Ticket ID:</b> <span className="break-all">{ticket.ticketId}</span></p>
          {ticket.scannedAt && (
            <p><b>Diverifikasi:</b> {ticket.scannedAt.toLocaleString("id-ID")}</p>
          )}
        </div>

        {success && (
          <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm font-semibold text-green-800">
            Tiket ini sekarang berada di <b>Riwayat Pesanan</b>, bukan lagi di Tiket Aktif.
          </div>
        )}

        <Link
          href="/"
          className="mt-7 inline-block rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
        >
          Kembali
        </Link>
      </div>
    </main>
  );
}

function VerificationError({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-surface px-4 py-12">
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm">
        <div className="rounded-2xl bg-red-50 p-6">
          <p className="text-xs font-black uppercase tracking-[.3em] text-red-600">Ticket Verification</p>
          <h1 className="mt-2 text-2xl font-black text-red-700">Verifikasi Gagal</h1>
          <p className="mt-3 text-sm text-slate-600">{message}</p>
        </div>
        <Link href="/" className="mt-7 inline-block rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white">
          Kembali
        </Link>
      </div>
    </main>
  );
}
