import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function TicketPage({searchParams}:{searchParams:Promise<{ticket?:string}>}){
 const user=await getCurrentUser(); if(!user) redirect("/login");
 const {ticket:ticketId}=await searchParams;
 if(!ticketId) redirect("/my-tickets");
 const ticket=await prisma.ticket.findFirst({where:{ticketId,userId:user.id}});
 if(!ticket) redirect("/my-tickets");
 const verifyUrl=`${process.env.NEXT_PUBLIC_APP_URL||"http://localhost:3000"}/ticket/verify?ticket=${ticket.ticketId}`;
 return <main className="min-h-screen bg-surface px-4 py-10"><div className="mx-auto max-w-lg">
   <div className="rounded-3xl bg-primary p-6 text-white shadow-xl"><p className="text-xs uppercase tracking-[.3em] text-blue-200">Ticket Confirmed</p><h1 className="mt-2 text-3xl font-black">Surabaya → Madura</h1><div className="mt-8 grid grid-cols-2 gap-5 text-sm"><div><span className="text-blue-200">Passenger</span><b className="block">{ticket.passengerName}</b></div><div><span className="text-blue-200">Departure</span><b className="block">{ticket.departureDate.toLocaleDateString("id-ID")}</b></div><div><span className="text-blue-200">Vehicle</span><b className="block">{ticket.vehicle||"passenger"}</b></div><div><span className="text-blue-200">Ticket ID</span><b className="block break-all">{ticket.ticketId}</b></div></div>
   </div>
   <div className="mt-5 rounded-3xl bg-white p-6 text-center shadow-sm"><p className="text-sm font-bold text-primary">QR verification URL</p><p className="mt-2 break-all text-xs text-slate-500">{verifyUrl}</p><Link href="/my-tickets" className="mt-5 inline-block rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white">My Tickets</Link></div>
 </div></main>;
}
