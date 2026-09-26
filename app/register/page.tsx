import Link from "next/link";
import { RegisterForm } from "@/components/auth-form";

export default function RegisterPage() {
  return <main className="site-gradient min-h-screen px-4 py-8 sm:flex sm:items-center sm:justify-center">
    <div className="soft-grid absolute inset-0 opacity-40" />
    <section className="relative mx-auto w-full max-w-md">
      <Link href="/login" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-white/85 transition hover:text-white"><span className="material-symbols-outlined">arrow_back</span>Kembali ke login</Link>
      <div className="aesthetic-card overflow-hidden rounded-[2rem]">
        <div className="site-gradient px-6 py-8 text-white sm:px-8 sm:py-9">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E0FF00] text-primary"><span className="material-symbols-outlined text-3xl">person_add</span></div>
          <p className="text-[10px] font-black uppercase tracking-[.25em] text-[#27F5F5]">Surabaya-Madura</p><h1 className="mt-2 text-3xl font-black">Buat akun baru</h1><p className="mt-2 text-sm leading-6 text-blue-100">Simpan data diri dan buat perjalanan berikutnya lebih cepat.</p>
        </div>
        <RegisterForm />
      </div>
    </section>
  </main>;
}
