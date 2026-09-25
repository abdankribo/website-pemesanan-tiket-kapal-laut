import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TicketVerification } from "@/components/ticket-verification";

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ ticket?: string }> }) {
  const { ticket: ticketId } = await searchParams;
  const ticket = ticketId
    ? await prisma.ticket.findUnique({ where: { ticketId } })
    : null;

  if (!ticket) {
    return (
      <main className="min-h-screen bg-surface px-4 py-12">
        <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-red-700">Ticket tidak ditemukan</h1>
          <p className="mt-2 text-sm text-slate-500">QR atau ticket ID tidak valid.</p>
          <Link href="/" className="mt-6 inline-block font-bold text-primary">
            Kembali
          </Link>
        </div>
      </main>
    );
  }

  const departure = new Date(ticket.departureDate);
  const departureText = departure.toLocaleDateString("id-ID");

  return (
    <TicketVerification
      ticketId={ticket.ticketId}
      passengerName={ticket.passengerName}
      origin={ticket.origin}
      destination={ticket.destination}
      departureDate={departureText}
      vehicle={ticket.vehicle || ""}
      vehiclePlate={ticket.vehiclePlate}
      initialStatus={ticket.status}
      initialScannedAt={ticket.scannedAt?.toISOString() || null}
    />
  );
}
