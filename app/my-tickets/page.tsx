import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function MyTicketsPage(){
 const user=await getCurrentUser(); if(!user) redirect("/login");
 const tickets=await prisma.ticket.findMany({where:{userId:user.id},orderBy:{createdAt:"desc"}});
 return <main className="min-h-screen bg-surface px-4 py-10"><div className="mx-auto max-w-3xl"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.3em] text-secondary">Account</p><h1 className="text-3xl font-black text-primary">My Tickets</h1></div><Link href="/account" className="text-sm font-bold text-primary">Profile</Link></div><div className="mt-8 space-y-4">{tickets.length===0?<div className="rounded-3xl bg-white p-8 text-center text-slate-500">Belum ada tiket.</div>:tickets.map(t=><div key={t.ticketId} className="rounded-3xl bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="font-black text-primary">{t.origin} → {t.destination}</p><p className="text-sm text-slate-500">{t.passengerName} · {t.departureDate.toLocaleDateString("id-ID")}</p></div><span className="rounded-full bg-green-100 px-3 py-1 text-[10px] font-black uppercase text-green-700">{t.status}</span></div><Link href={"/ticket?ticket="+t.ticketId} className="mt-4 inline-block rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white">View Ticket</Link></div>)}</div></div></main>;
}
