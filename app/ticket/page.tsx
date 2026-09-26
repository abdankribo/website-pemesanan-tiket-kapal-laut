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

  const ticket = await prisma.ticket.findFirst({
    where: { ticketId, userId: user.id },
  });
  if (!ticket) redirect("/my-tickets");

  // QR codes must always point to the public production origin, never the
  // current Preview/deployment hostname. Otherwise scanning a Preview QR can
  // trigger Vercel Deployment Protection and ask the customer to log in.
  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const baseUrl = (
    configuredAppUrl ||
    (vercelProductionUrl ? `https://${vercelProductionUrl}` : "http://localhost:3000")
  ).replace(/\/$/, "");

  const verifyUrl = `${baseUrl}/ticket/verify?ticket=${encodeURIComponent(ticket.ticketId)}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    width: 320,
    margin: 2,
    errorCorrectionLevel: "M",
  });

  const verified = ticket.status === "scanned";

  return (
    <main className="min-h-screen bg-surface px-4 py-10 pb-24">
      <div className="mx-auto max-w-lg">
        <div className="mb-4 flex justify-end"><Link href="/" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-primary shadow-sm">Dashboard</Link></div>
        <div className="rounded-3xl bg-primary p-6 text-white shadow-xl">
          <p className="text-xs uppercase tracking-[.3em] text-blue-200">Your Boarding Pass</p>
          <h1 className="mt-2 text-3xl font-black">{ticket.origin} → {ticket.destination}</h1>
          <div className="mt-8 grid grid-cols-2 gap-5 text-sm">
            <div><span className="text-blue-200">Passenger</span><b className="block">{ticket.passengerName}</b></div>
            <div><span className="text-blue-200">Departure</span><b className="block">{ticket.departureDate.toLocaleDateString("id-ID")}</b></div>
            <div><span className="text-blue-200">Vehicle</span><b className="block">{ticket.vehicle || "passenger"}</b></div>
            <div><span className="text-blue-200">Ticket ID</span><b className="block break-all">{ticket.ticketId}</b></div>
          </div>
          <div className="mt-6 rounded-2xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-wider text-blue-200">Status</p>
            <p className="mt-1 font-black">{verified ? "Sudah Terverifikasi" : "Belum Terverifikasi"}</p>
          </div>
        </div>

        <div className="mt-5 rounded-3xl bg-white p-6 text-center shadow-sm">
          <div className="mx-auto w-fit rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
            <img src={qrDataUrl} alt="QR tiket untuk verifikasi" width={240} height={240} className="h-60 w-60" />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-slate-500">
            {verified ? "Tiket sudah diverifikasi" : "Scan untuk verifikasi"}
          </p>
          <p className="mt-2 break-all text-xs text-slate-400">{verifyUrl}</p>
          <Link href="/my-tickets" className="mt-5 inline-block rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white">
            My Tickets
          </Link>
        </div>
      </div>
    </main>
  );
}
