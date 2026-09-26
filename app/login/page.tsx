import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth-form";

export default function LoginPage() {
  return <main className="site-gradient min-h-screen px-4 py-8 sm:flex sm:items-center sm:justify-center">
    <div className="soft-grid absolute inset-0 opacity-40" />
    <section className="relative mx-auto w-full max-w-md">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-white/85 transition hover:text-white"><span className="material-symbols-outlined text-lg">arrow_back</span>Kembali ke Explore</Link>
      <div className="aesthetic-card overflow-hidden rounded-[2rem]">
        <div className="site-gradient px-6 py-8 text-white sm:px-8 sm:py-9">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E0FF00] text-primary"><span className="material-symbols-outlined text-3xl">lock</span></div>
          <p className="text-[10px] font-black uppercase tracking-[.25em] text-[#27F5F5]">Surabaya-Madura</p><h1 className="mt-2 text-3xl font-black">Selamat datang kembali</h1><p className="mt-2 text-sm leading-6 text-blue-100">Masuk untuk memesan tiket dan mengakses boarding pass digital.</p>
        </div>
        <Suspense fallback={<div className="px-6 py-8 text-sm text-slate-500">Memuat formulir...</div>}><LoginForm /></Suspense>
      </div>
    </section>
  </main>;
}
