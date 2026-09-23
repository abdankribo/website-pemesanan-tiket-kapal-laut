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
  const active = tickets.filter((t) => new Date(t.departureDate) >= today && t.status !== "cancelled");
  const expired = tickets.filter((t) => new Date(t.departureDate) < today || t.status === "cancelled");

  function TicketCard({ ticket }: { ticket: (typeof tickets)[number] }) {
    const isExpired = new Date(ticket.departureDate) < today || ticket.status === "cancelled";
    return (
      <article className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-black text-primary">{ticket.origin} → {ticket.destination}</p>
            <p className="mt-1 text-sm text-slate-500">{ticket.passengerName} · {ticket.departureDate.toLocaleDateString("id-ID")}</p>
            <p className="mt-1 text-xs text-slate-400">{ticket.vehiclePlate || ticket.vehicle || "Passenger"}</p>
          </div>
          <span className={"shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase " + (isExpired ? "bg-slate-100 text-slate-500" : ticket.status === "scanned" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700")}>
            {isExpired ? "expired" : ticket.status}
          </span>
        </div>
        <Link href={"/ticket?ticket=" + ticket.ticketId} className="mt-4 inline-block rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white">View Ticket</Link>
      </article>
    );
  }

  return (
    <main className="min-h-screen bg-surface px-4 py-10 pb-24">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[.3em] text-secondary">Account</p><h1 className="text-3xl font-black text-primary">My Tickets</h1></div>
          <Link href="/account" className="text-sm font-bold text-primary">Profile</Link>
        </div>

        {tickets.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-black text-primary">Belum ada tiket</p>
            <p className="mt-2 text-sm text-slate-500">Pesan tiket kapal untuk melihat boarding pass Anda di sini.</p>
            <Link href="/booking" className="mt-5 inline-block rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white">Pesan Tiket</Link>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            <section><h2 className="mb-3 text-sm font-black uppercase tracking-wider text-primary">Tiket Aktif ({active.length})</h2>{active.length ? <div className="space-y-4">{active.map((t) => <TicketCard key={t.ticketId} ticket={t} />)}</div> : <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">Tidak ada tiket aktif.</div>}</section>
            <section><h2 className="mb-3 text-sm font-black uppercase tracking-wider text-slate-500">Riwayat ({expired.length})</h2>{expired.length ? <div className="space-y-4">{expired.map((t) => <TicketCard key={t.ticketId} ticket={t} />)}</div> : <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">Belum ada riwayat tiket.</div>}</section>
          </div>
        )}
      </div>
    </main>
  );
}
