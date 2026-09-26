import { redirect } from "next/navigation";
import Link from "next/link";
import ClearProfileForm from "@/components/clear-profile-form";
import { getCurrentUser } from "@/lib/auth";

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const params = await searchParams;

  return (
    <main className="min-h-screen px-4 py-10 pb-28">
      <div className="mx-auto max-w-xl">
        <header className="flex items-center justify-between gap-4">
          <div><p className="text-xs font-black uppercase tracking-[.3em] text-[#0079ad]">Account</p><h1 className="mt-1 text-3xl font-black text-primary">Profil Anda</h1><p className="mt-1 text-sm text-slate-500">Kelola data yang digunakan saat booking.</p></div>
          <div className="hidden gap-2 sm:flex"><Link href="/" className="ghost-btn rounded-xl px-3 py-2 text-xs font-bold">Dashboard</Link><Link href="/my-tickets" className="primary-btn rounded-xl px-3 py-2 text-xs font-bold">Tiket Saya</Link></div>
        </header>
        {params.saved === "1" && <p className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">Profil berhasil diperbarui.</p>}
        {params.error === "email" && <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">Email sudah digunakan akun lain.</p>}
        {params.error === "invalid" && <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">Periksa kembali data profil Anda.</p>}
        <div className="aesthetic-card mt-7 rounded-[2rem] p-5 sm:p-7">
          <form action="/api/profile/update" method="POST" className="space-y-4">
            <label className="block text-sm font-semibold">Nama<input name="name" defaultValue={user.name} required maxLength={100} className="input mt-2"/></label>
            <label className="block text-sm font-semibold">Email<input name="email" type="email" defaultValue={user.email} required maxLength={150} className="input mt-2"/></label>
            <label className="block text-sm font-semibold">Nomor HP<input name="phone" inputMode="numeric" defaultValue={user.phone||""} placeholder="08xxxxxxxxxx" required className="input mt-2"/></label>
            <label className="block text-sm font-semibold">NIK<input name="nik" inputMode="numeric" maxLength={16} defaultValue={user.nik||""} placeholder="16 digit" required className="input mt-2"/></label>
            <label className="block text-sm font-semibold">Tanggal lahir<input name="birth_date" type="date" defaultValue={user.birthDate?user.birthDate.toISOString().slice(0,10):""} required className="input mt-2"/></label>
            <button className="primary-btn w-full rounded-2xl px-5 py-3.5 font-bold">Simpan Profil</button>
          </form>
          <ClearProfileForm />
          <form action="/api/auth/logout" method="POST" className="mt-4"><button className="ghost-btn w-full rounded-2xl px-5 py-3 text-sm font-bold">Logout</button></form>
        </div>
      </div>
    </main>
  );
}
