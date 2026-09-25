import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function MyTicketsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const tickets = await prisma.ticket.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isExpired = (ticket: (typeof tickets)[number]) => {
    const departure = new Date(ticket.departureDate);
    departure.setHours(0, 0, 0, 0);
    return departure < today;
  };

  const active = tickets.filter(
    (ticket) =>
      !isExpired(ticket) &&
      ticket.status !== "scanned" &&
      ticket.status !== "cancelled",
  );

  const history = tickets.filter(
    (ticket) =>
      ticket.status === "scanned" ||
      ticket.status === "cancelled" ||
      isExpired(ticket),
  );

  function TicketCard({ ticket }: { ticket: (typeof tickets)[number] }) {
    const expired = isExpired(ticket);
    const verified = ticket.status === "scanned";
    const cancelled = ticket.status === "cancelled";

    const label = verified
      ? "Terverifikasi"
      : cancelled
        ? "Dibatalkan"
        : expired
          ? "Kedaluwarsa"
          : "Belum Terverifikasi";

    const badgeClass = verified
      ? "bg-green-100 text-green-700"
      : cancelled || expired
        ? "bg-slate-100 text-slate-500"
        : "bg-amber-100 text-amber-700";

    return (
      <article className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-black text-primary">
              {ticket.origin} → {ticket.destination}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {ticket.passengerName} · {ticket.departureDate.toLocaleDateString("id-ID")}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {ticket.vehiclePlate || ticket.vehicle || "Passenger"}
            </p>
            {verified && ticket.scannedAt && (
              <p className="mt-2 text-xs font-semibold text-green-700">
                Diverifikasi {ticket.scannedAt.toLocaleString("id-ID")}
              </p>
            )}
          </div>

          <span
            className={
              "shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase " +
              badgeClass
            }
          >
            {label}
          </span>
        </div>

        <Link
          href={"/ticket?ticket=" + ticket.ticketId}
          className="mt-4 inline-block rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white"
        >
          Lihat Tiket
        </Link>
      </article>
    );
  }

  return (
    <main className="min-h-screen bg-surface px-4 py-10 pb-24">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-secondary">
              Account
            </p>
            <h1 className="text-3xl font-black text-primary">My Tickets</h1>
          </div>
          <Link href="/account" className="text-sm font-bold text-primary">
            Profile
          </Link>
        </div>

        {tickets.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-black text-primary">Belum ada tiket</p>
            <p className="mt-2 text-sm text-slate-500">
              Pesan tiket kapal untuk melihat boarding pass Anda di sini.
            </p>
            <Link
              href="/booking"
              className="mt-5 inline-block rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
            >
              Pesan Tiket
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            <section>
              <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-primary">
                Tiket Aktif ({active.length})
              </h2>
              {active.length ? (
                <div className="space-y-4">
                  {active.map((ticket) => (
                    <TicketCard key={ticket.ticketId} ticket={ticket} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
                  Tidak ada tiket aktif.
                </div>
              )}
            </section>

            <section>
              <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-slate-500">
                Riwayat Pesanan ({history.length})
              </h2>
              {history.length ? (
                <div className="space-y-4">
                  {history.map((ticket) => (
                    <TicketCard key={ticket.ticketId} ticket={ticket} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
                  Belum ada riwayat pesanan.
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
