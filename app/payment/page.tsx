import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function PaymentPage({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
 const user=await getCurrentUser(); if(!user)redirect("/login");
 const p=await searchParams; const draftId=p.draft; if(!draftId)redirect("/booking");
 const draft=await prisma.bookingDraft.findFirst({where:{id:draftId,userId:user.id}}); if(!draft||draft.expiresAt<new Date())redirect("/booking?error=Booking%20sudah%20kedaluwarsa");
 const data=draft.payload as Record<string,unknown>; const total=Number(data.basePrice||0)+5000;
 return <main className="min-h-screen px-3 py-8 sm:px-6"><div className="mx-auto max-w-5xl"><Link href="/booking" className="ghost-btn inline-flex rounded-xl px-3 py-2 text-xs font-bold">← Kembali ke booking</Link>
  <div className="mt-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"><span className="rounded-full bg-primary px-3 py-1 text-white">01 Booking</span><span>—</span><span className="rounded-full bg-[#E0FF00] px-3 py-1 text-primary">02 Payment</span></div>
  <div className="mt-6 grid gap-5 lg:grid-cols-[1.55fr_1fr]"><section className="aesthetic-card rounded-[2rem] p-6 sm:p-8"><p className="text-xs font-black uppercase tracking-[.3em] text-[#00B4FF]">Secure checkout</p><h1 className="mt-1 text-3xl font-black text-primary">Selesaikan Pembayaran</h1><p className="mt-2 text-sm text-slate-500">Pilih metode pembayaran simulasi untuk menyelesaikan pemesanan.</p>
   <form action="/api/payment/complete" method="POST" className="mt-7 space-y-3"><input type="hidden" name="draft_id" value={draftId}/>{["mandiri","bca","gopay"].map(x=><label key={x} className="interactive-card flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white/70 p-4 hover:border-[#00B4FF]"><span className="font-black uppercase text-primary">{x}</span><input type="radio" name="payment_method" value={x} required /></label>)}<button className="accent-btn mt-2 w-full rounded-2xl px-5 py-4 text-sm font-black">Bayar Sekarang · IDR {total.toLocaleString("id-ID")}</button></form>
  </section><aside className="site-gradient h-fit rounded-[2rem] p-6 text-white shadow-xl shadow-blue-950/15"><p className="text-xs uppercase tracking-widest text-[#27F5F5]">Order Summary</p><div className="mt-6 space-y-4 text-sm"><div className="flex justify-between gap-5"><span className="text-blue-200">Route</span><b>{String(data.origin)} → {String(data.destination)}</b></div><div className="flex justify-between gap-5"><span className="text-blue-200">Passenger</span><b>{String(data.passengerName)}</b></div><div className="flex justify-between gap-5"><span className="text-blue-200">Vehicle</span><b>{String(data.vehicle)}</b></div><div className="mt-5 flex justify-between border-t border-white/15 pt-4 text-lg"><span>Total</span><b>{`IDR ${total.toLocaleString("id-ID")}`}</b></div></div></aside></div>
 </div></main>;
}
