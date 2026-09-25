import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import BookingForm from "@/components/booking-form";

export default async function BookingPage() {
  const user=await getCurrentUser();
  if(!user) redirect("/login");
  return <main className="min-h-screen bg-surface px-3 pb-32 pt-20 sm:px-6 sm:pt-24"><div className="mx-auto max-w-2xl">
    <header className="mb-6 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.3em] text-secondary">Your Booking</p><h1 className="text-2xl font-black text-primary">Pesan Tiket Kapal</h1></div><div className="flex items-center gap-4"><Link href="/my-tickets" className="text-sm font-bold text-primary">Tiket Saya</Link><Link href="/account" className="text-sm font-bold text-primary">Akun</Link></div></header>
    <section className="mb-6 rounded-2xl bg-primary p-5 text-white"><p className="text-xs text-blue-200">Data profil otomatis digunakan sebagai nilai awal.</p><p className="mt-1 font-bold">{user.name} · {user.email}</p></section>
    <BookingForm defaults={{name:user.name,nik:user.nik||"",phone:user.phone||""}}/>
  </div></main>;
}
