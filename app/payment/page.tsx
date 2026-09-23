import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function PaymentPage({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
 const user=await getCurrentUser(); if(!user)redirect("/login");
 const p=await searchParams; const draftId=p.draft;
 if(!draftId)redirect("/booking");
 const draft=await prisma.bookingDraft.findFirst({where:{id:draftId,userId:user.id}});
 if(!draft||draft.expiresAt<new Date())redirect("/booking?error=Booking%20sudah%20kedaluwarsa");
 const data=draft.payload as Record<string,unknown>; const total=Number(data.basePrice||0)+5000;
 return <main className="min-h-screen bg-surface px-3 py-8 sm:px-6"><div className="mx-auto max-w-5xl"><Link href="/booking" className="text-sm font-bold text-primary">← Kembali ke booking</Link><div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]"><section className="rounded-3xl bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-[.3em] text-slate-500">Current Step</p><h1 className="mt-1 text-3xl font-black text-primary">Payment</h1><form action="/api/payment/complete" method="POST" className="mt-8 space-y-4"><input type="hidden" name="draft_id" value={draftId}/><p className="text-sm text-slate-600">Pilih metode pembayaran simulasi untuk menyelesaikan pemesanan.</p>{["mandiri","bca","gopay"].map(x=><label key={x} className="flex cursor-pointer items-center justify-between rounded-2xl border p-4 hover:border-primary"><span className="font-bold uppercase">{x}</span><input type="radio" name="payment_method" value={x} required/></label>)}<button className="w-full rounded-xl bg-primary px-5 py-4 text-sm font-black text-white">Pay Now · IDR {total.toLocaleString("id-ID")}</button></form></section><aside className="h-fit rounded-3xl bg-primary p-6 text-white"><p className="text-xs uppercase tracking-widest text-blue-200">Order Summary</p><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><span>Route</span><b>{String(data.origin)} → {String(data.destination)}</b></div><div className="flex justify-between"><span>Passenger</span><b>{String(data.passengerName)}</b></div><div className="flex justify-between"><span>Vehicle</span><b>{String(data.vehicle)}</b></div><div className="border-t border-white/20 pt-3 flex justify-between text-lg"><span>Total</span><b>IDR {total.toLocaleString("id-ID")}</b></div></div></aside></div></div></main>;
}
