import Link from "next/link";
import { RegisterForm } from "@/components/auth-form";

export default function RegisterPage() {
  return <main className="min-h-screen bg-slate-100 px-4 py-8 sm:flex sm:items-center sm:justify-center">
    <section className="mx-auto w-full max-w-md">
      <Link href="/login" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-primary"><span className="material-symbols-outlined text-lg">arrow_back</span>Kembali ke login</Link>
      <div className="overflow-hidden rounded-3xl bg-white shadow-[0_16px_40px_-18px_rgba(0,48,99,.3)]">
        <div className="bg-primary px-5 py-7 text-white sm:px-8 sm:py-9"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-container text-primary"><span className="material-symbols-outlined text-3xl">person_add</span></div><p className="text-[10px] font-bold uppercase tracking-[.25em] text-primary-fixed-dim">Surabaya-Madura</p><h1 className="mt-2 text-2xl font-black sm:text-3xl">Buat akun baru</h1><p className="mt-2 text-sm text-primary-fixed">Daftar untuk menyimpan data diri dan memesan tiket lebih cepat.</p></div>
        <RegisterForm />
      </div>
    </section>
  </main>;
}