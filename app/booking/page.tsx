import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import BookingForm from "@/components/booking-form";

export default async function BookingPage() {
  const user=await getCurrentUser();
  if(!user) redirect("/login");
  return (
    <main className="min-h-screen px-3 pb-32 pt-24 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <header className="mb-7 flex items-center justify-between gap-4">
          <div><p className="text-[10px] font-black uppercase tracking-[.3em] text-[#0079ad]">01 · Booking</p><h1 className="mt-1 text-3xl font-black tracking-tight text-primary">Pesan Tiket Kapal</h1><p className="mt-1 text-sm text-slate-500">Isi data perjalanan Anda dengan cepat.</p></div>
          <div className="hidden items-center gap-2 sm:flex"><Link href="/" className="ghost-btn rounded-xl px-3 py-2 text-xs font-bold">Dashboard</Link><Link href="/my-tickets" className="ghost-btn rounded-xl px-3 py-2 text-xs font-bold">Tiket Saya</Link><Link href="/account" className="ghost-btn rounded-xl px-3 py-2 text-xs font-bold">Akun</Link></div>
        </header>
        <section className="site-gradient mb-5 overflow-hidden rounded-3xl p-5 text-white shadow-xl shadow-blue-950/10">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#27F5F5]/10 text-[#00a8b0]"><span className="material-symbols-outlined">auto_awesome</span></span><div><p className="text-[10px] uppercase tracking-[.2em] text-blue-200">Passenger profile</p><p className="mt-1 font-bold">{user.name} <span className="font-normal text-blue-200">· {user.email}</span></p></div></div>
        </section>
        <BookingForm defaults={{name:user.name,nik:user.nik||"",phone:user.phone||""}}/>
      </div>
    </main>
  );
}
