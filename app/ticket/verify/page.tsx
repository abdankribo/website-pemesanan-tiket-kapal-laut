import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function VerifyPage({searchParams}:{searchParams:Promise<{ticket?:string}>}){
 const {ticket:ticketId}=await searchParams;
 const ticket=ticketId?await prisma.ticket.findUnique({where:{ticketId}}):null;
 if(!ticket) return <main className="min-h-screen bg-surface px-4 py-12"><div className="mx-auto max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm"><h1 className="text-2xl font-black text-red-700">Ticket tidak ditemukan</h1><p className="mt-2 text-sm text-slate-500">QR atau ticket ID tidak valid.</p></div></main>;
 const status=new Date(ticket.departureDate)<new Date(new Date().toDateString())?"expired":"completed";
 if(ticket.status==="booked") await prisma.ticket.update({where:{id:ticket.id},data:{status,scannedAt:new Date()}});
 return <main className="min-h-screen bg-surface px-4 py-12"><div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-sm"><p className="text-xs font-bold uppercase tracking-[.3em] text-secondary">Ticket Verification</p><h1 className="mt-2 text-3xl font-black text-primary">{status==="expired"?"Expired":"Verified"}</h1><div className="mt-6 space-y-3 text-sm"><p><b>Passenger:</b> {ticket.passengerName}</p><p><b>Route:</b> {ticket.origin} → {ticket.destination}</p><p><b>Departure:</b> {ticket.departureDate.toLocaleDateString("id-ID")}</p><p><b>Vehicle:</b> {ticket.vehiclePlate||ticket.vehicle||"Tidak ada"}</p><p><b>Status:</b> {status}</p></div><Link href="/" className="mt-7 inline-block text-sm font-bold text-primary">Kembali</Link></div></main>;
}
