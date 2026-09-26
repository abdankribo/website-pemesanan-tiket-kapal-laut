import { redirect } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function TicketPage({ searchParams }: { searchParams: Promise<{ ticket?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { ticket: ticketId } = await searchParams;
  if (!ticketId) redirect("/my-tickets");
  const ticket = await prisma.ticket.findFirst({ where: { ticketId, userId: user.id } });
  if (!ticket) redirect("/my-tickets");

  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const baseUrl = (configuredAppUrl || (vercelProductionUrl ? `https://${vercelProductionUrl}` : "http://localhost:3000")).replace(/\/$/, "");
  const verifyUrl = `${baseUrl}/ticket/verify?ticket=${encodeURIComponent(ticket.ticketId)}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 320, margin: 2, errorCorrectionLevel: "M" });
  const verified = ticket.status === "scanned";

  return (
    <main className="min-h-screen px-4 py-10 pb-28">
      <div className="mx-auto max-w-lg">
        <Link href="/" className="ghost-btn mb-5 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold">← Dashboard</Link>
        <div className="site-gradient overflow-hidden rounded-[2rem] p-6 text-white shadow-2xl shadow-blue-950/15 sm:p-7">
          <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[.3em] text-[#00a8b0]">Digital Boarding Pass</p><h1 className="mt-2 text-3xl font-black">{ticket.origin} → {ticket.destination}</h1></div><span className={`rounded-full px-3 py-1 text-[10px] font-black ${verified?"bg-[#27F5F5] text-primary":"bg-[#d6ed00] text-primary"}`}>{verified?"VERIFIED":"READY"}</span></div>
          <div className="mt-8 grid grid-cols-2 gap-5 text-sm"><div><span className="text-blue-200">Passenger</span><b className="mt-1 block">{ticket.passengerName}</b></div><div><span className="text-blue-200">Departure</span><b className="mt-1 block">{ticket.departureDate.toLocaleDateString("id-ID")}</b></div><div><span className="text-blue-200">Vehicle</span><b className="mt-1 block">{ticket.vehicle||"passenger"}</b></div><div><span className="text-blue-200">Ticket ID</span><b className="mt-1 block break-all text-xs">{ticket.ticketId}</b></div></div>
        </div>
        <div className="aesthetic-card mt-4 rounded-[2rem] p-6 text-center">
          <p className="text-xs font-black uppercase tracking-[.2em] text-[#0079ad]">{verified?"Tiket sudah diverifikasi":"Scan QR saat boarding"}</p>
          <div className="mx-auto mt-5 w-fit rounded-3xl bg-white p-3 shadow-xl ring-1 ring-slate-100"><img src={qrDataUrl} alt="QR tiket untuk verifikasi" width={240} height={240} className="h-60 w-60" /></div>
          <p className="mt-4 break-all text-[10px] leading-5 text-slate-400">{verifyUrl}</p>
          <Link href="/my-tickets" className="primary-btn mt-5 inline-flex rounded-xl px-5 py-3 text-sm font-bold">Kembali ke Tiket</Link>
        </div>
      </div>
    </main>
  );
}
