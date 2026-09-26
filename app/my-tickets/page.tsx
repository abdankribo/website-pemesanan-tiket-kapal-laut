import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function MyTicketsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const tickets = await prisma.ticket.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  const today = new Date(); today.setHours(0,0,0,0);
  const isExpired = (ticket: (typeof tickets)[number]) => { const departure = new Date(ticket.departureDate); departure.setHours(0,0,0,0); return departure < today; };
  const active = tickets.filter(ticket => !isExpired(ticket) && ticket.status !== "scanned" && ticket.status !== "cancelled");
  const history = tickets.filter(ticket => ticket.status === "scanned" || ticket.status === "cancelled" || isExpired(ticket));

  function TicketCard({ticket,historyCard=false}:{ticket:(typeof tickets)[number];historyCard?:boolean}) {
    const expired=isExpired(ticket), verified=ticket.status==="scanned", cancelled=ticket.status==="cancelled";
    const label=verified?"Terverifikasi":cancelled?"Dibatalkan":expired?"Kedaluwarsa":"Belum Terverifikasi";
    const badgeClass=verified?"bg-[#27F5F5]/20 text-primary":cancelled||expired?"bg-slate-100 text-slate-500":"bg-[#E0FF00]/50 text-primary";
    return (
      <article className={`interactive-card aesthetic-card rounded-3xl p-5 ${verified&&historyCard?"ring-2 ring-[#27F5F5]/30":""}`}>
        {verified&&historyCard&&<div className="mb-4 flex items-center gap-2 rounded-2xl bg-[#27F5F5]/10 px-4 py-3 text-sm font-bold text-primary"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[#27F5F5]">✓</span>Tiket sudah digunakan dan terverifikasi</div>}
        <div className="flex items-start justify-between gap-4">
          <div><p className="font-black text-primary">{ticket.origin} → {ticket.destination}</p><p className="mt-1 text-sm text-slate-500">{ticket.passengerName} · {ticket.departureDate.toLocaleDateString("id-ID")}</p><p className="mt-1 text-xs text-slate-400">{ticket.vehiclePlate||ticket.vehicle||"Passenger"}</p>{verified&&ticket.scannedAt&&<p className="mt-2 text-xs font-semibold text-[#087a3d]">Diverifikasi {ticket.scannedAt.toLocaleString("id-ID",{dateStyle:"medium",timeStyle:"short"})}</p>}</div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase ${badgeClass}`}>{label}</span>
        </div>
        <Link href={"/ticket?ticket="+ticket.ticketId} className={`primary-btn mt-4 inline-flex rounded-xl px-4 py-2 text-xs font-bold ${verified?"!bg-[#087a3d]":""}`}>Lihat Tiket <span className="ml-1">→</span></Link>
      </article>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10 pb-28">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between gap-4">
          <div><p className="text-xs font-black uppercase tracking-[.3em] text-[#00B4FF]">Account</p><h1 className="mt-1 text-3xl font-black text-primary">Tiket Saya</h1><p className="mt-1 text-sm text-slate-500">Boarding pass aktif dan riwayat perjalanan.</p></div>
          <div className="hidden gap-2 sm:flex"><Link href="/" className="ghost-btn rounded-xl px-3 py-2 text-xs font-bold">Dashboard</Link><Link href="/account" className="ghost-btn rounded-xl px-3 py-2 text-xs font-bold">Profile</Link></div>
        </header>
        {tickets.length===0 ? <div className="aesthetic-card mt-8 rounded-[2rem] p-10 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#27F5F5]/15 text-primary"><span className="material-symbols-outlined text-2xl">confirmation_number</span></span><p className="mt-5 text-lg font-black text-primary">Belum ada tiket</p><p className="mt-2 text-sm text-slate-500">Pesan tiket kapal untuk melihat boarding pass Anda di sini.</p><Link href="/booking" className="primary-btn mt-5 inline-flex rounded-xl px-5 py-3 text-sm font-bold">Pesan Tiket</Link></div> : <div className="mt-8 space-y-8">
          <section><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-black uppercase tracking-wider text-primary">Tiket Aktif</h2><span className="rounded-full bg-[#E0FF00]/50 px-2.5 py-1 text-[10px] font-black text-primary">{active.length}</span></div>{active.length?<div className="space-y-4">{active.map(ticket=><TicketCard key={ticket.ticketId} ticket={ticket}/>)}</div>:<div className="aesthetic-card rounded-2xl p-5 text-sm text-slate-500">Tidak ada tiket aktif.</div>}</section>
          <section><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-black uppercase tracking-wider text-slate-500">Riwayat Pesanan</h2><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-500">{history.length}</span></div>{history.length?<div className="space-y-4">{history.map(ticket=><TicketCard key={ticket.ticketId} ticket={ticket} historyCard/>)}</div>:<div className="aesthetic-card rounded-2xl p-5 text-sm text-slate-500">Belum ada riwayat pesanan.</div>}</section>
        </div>}
      </div>
    </main>
  );
}
