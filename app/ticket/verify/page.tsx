import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

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

type VerificationOutcome =
  | { kind: "error"; message: string }
  | {
      kind: "result";
      ticket: Ticket;
      title: string;
      message: string;
      tone: "success" | "error";
      alreadyVerified?: boolean;
    };

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ ticket?: string }>;
}) {
  const { ticket: ticketId } = await searchParams;
  const cleanTicketId = String(ticketId || "").trim();

  if (!cleanTicketId) {
    return <VerificationError message="QR atau Ticket ID tidak valid." />;
  }

  const outcome = await verifyTicket(cleanTicketId);

  if (outcome.kind === "error") {
    return <VerificationError message={outcome.message} />;
  }

  return (
    <VerificationResult
      ticket={outcome.ticket}
      title={outcome.title}
      message={outcome.message}
      tone={outcome.tone}
      alreadyVerified={outcome.alreadyVerified}
      primaryLabel="Kembali"
    />
  );
}

async function verifyTicket(cleanTicketId: string): Promise<VerificationOutcome> {
  try {
    const request = new Request(
      "https://ticket-verification.local/ticket/verify",
      {
        headers: { "x-forwarded-for": "qr-scan" },
      },
    );

    if (
      !(await checkRateLimit(
        request,
        "ticket-verify-page",
        cleanTicketId,
        20,
        60 * 60 * 1000,
      ))
    ) {
      return {
        kind: "error",
        message: "Terlalu banyak percobaan verifikasi. Coba lagi nanti.",
      };
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
      return { kind: "error", message: "Tiket tidak ditemukan." };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const departure = new Date(ticket.departureDate);
    departure.setHours(0, 0, 0, 0);

    if (departure < today) {
      return {
        kind: "result",
        ticket,
        title: "TIKET KEDALUWARSA",
        message: "Tiket sudah melewati tanggal keberangkatan.",
        tone: "error",
      };
    }

    if (ticket.status === "cancelled") {
      return {
        kind: "result",
        ticket,
        title: "TIKET DIBATALKAN",
        message: "Tiket ini sudah dibatalkan dan tidak dapat digunakan.",
        tone: "error",
      };
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
          return {
            kind: "error",
            message: "Status tiket berubah. Silakan scan ulang.",
          };
        }

        verifiedTicket = current;
        alreadyVerified = true;
      }
    }

    return {
      kind: "result",
      ticket: verifiedTicket,
      title: "TIKET BERHASIL DIVERIFIKASI",
      message: alreadyVerified
        ? "Tiket ini sudah diverifikasi sebelumnya."
        : "Tiket sah dan berhasil dicatat sebagai tiket yang sudah digunakan.",
      tone: "success",
      alreadyVerified,
    };
  } catch (error) {
    console.error("TICKET_VERIFY_PAGE_ERROR", error);
    return {
      kind: "error",
      message:
        "Terjadi kesalahan saat memverifikasi tiket. Silakan scan ulang.",
    };
  }
}

function VerificationResult({
  ticket,
  title,
  message,
  tone,
  alreadyVerified = false,
  primaryLabel,
}: {
  ticket: Ticket;
  title: string;
  message: string;
  tone: "success" | "error";
  alreadyVerified?: boolean;
  primaryLabel: string;
}) {
  const success = tone === "success";

  return (
    <main
      className={
        success
          ? "min-h-screen bg-[#eef8f1] px-4 py-6 sm:py-10"
          : "min-h-screen bg-[#fff1f1] px-4 py-6 sm:py-10"
      }
    >
      <div className="mx-auto max-w-xl">
        <header className="mb-5 flex items-center justify-between px-1">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-500">
              Petugas Loket
            </p>
            <p className="text-lg font-black text-slate-900">
              Verifikasi Tiket
            </p>
          </div>
          <div
            className={
              success
                ? "rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-green-700 shadow-sm"
                : "rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-700 shadow-sm"
            }
          >
            Scan Result
          </div>
        </header>

        <section
          className={
            success
              ? "overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-green-100"
              : "overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-red-100"
          }
        >
          <div
            className={
              success
                ? "bg-[#087a3d] px-6 py-8 text-center text-white sm:px-10 sm:py-10"
                : "bg-[#b42318] px-6 py-8 text-center text-white sm:px-10 sm:py-10"
            }
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-5xl shadow-lg">
              {success ? "✓" : "!"}
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.28em] opacity-80">
              {success
                ? alreadyVerified
                  ? "Sudah tercatat"
                  : "Scan berhasil"
                : "Perhatian"}
            </p>

            <h1 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">
              {title}
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-6 text-white/90">
              {message}
            </p>
          </div>

          <div className="p-5 sm:p-7">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                Penumpang
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {ticket.passengerName}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-200 pt-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Rute
                  </p>
                  <p className="mt-1 font-black text-slate-800">
                    {ticket.origin} → {ticket.destination}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Keberangkatan
                  </p>
                  <p className="mt-1 font-black text-slate-800">
                    {ticket.departureDate.toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Kendaraan
                  </p>
                  <p className="mt-1 font-black text-slate-800">
                    {ticket.vehiclePlate || ticket.vehicle || "Passenger"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Status
                  </p>
                  <p
                    className={
                      success
                        ? "mt-1 font-black text-green-700"
                        : "mt-1 font-black text-red-700"
                    }
                  >
                    {success ? "TERVERIFIKASI" : "TIDAK VALID"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Ticket ID
                  </p>
                  <p className="mt-1 break-all font-mono text-xs font-bold text-slate-700">
                    {ticket.ticketId}
                  </p>
                </div>

                {ticket.scannedAt && (
                  <div className="shrink-0 text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Diverifikasi
                    </p>
                    <p className="mt-1 text-xs font-bold text-slate-700">
                      {ticket.scannedAt.toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {success && (
              <div className="mt-4 rounded-2xl bg-green-50 px-4 py-3 text-center text-sm font-bold text-green-800">
                Tiket sudah dipindahkan ke <b>Riwayat Pesanan</b>.
              </div>
            )}

            <Link
              href="/"
              className="mt-5 block w-full rounded-2xl bg-slate-900 px-5 py-4 text-center text-sm font-black text-white transition hover:bg-slate-800"
            >
              {primaryLabel}
            </Link>
          </div>
        </section>

        <p className="mt-5 text-center text-xs font-medium text-slate-500">
          Hasil verifikasi ini berasal langsung dari sistem tiket.
        </p>
      </div>
    </main>
  );
}

function VerificationError({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-[#fff1f1] px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-xl">
        <div className="mb-5 px-1">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-500">
            Petugas Loket
          </p>
          <p className="text-lg font-black text-slate-900">
            Verifikasi Tiket
          </p>
        </div>

        <section className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-red-100">
          <div className="bg-[#b42318] px-6 py-10 text-center text-white sm:px-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-4xl font-black text-red-700 shadow-lg">
              !
            </div>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.28em] text-white/80">
              Scan Gagal
            </p>
            <h1 className="mt-2 text-3xl font-black">TIKET TIDAK VALID</h1>
            <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-6 text-white/90">
              {message}
            </p>
          </div>

          <div className="p-6">
            <Link
              href="/"
              className="block w-full rounded-2xl bg-slate-900 px-5 py-4 text-center text-sm font-black text-white"
            >
              Kembali
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
