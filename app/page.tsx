import Link from "next/link";
import SearchForm from "@/components/search-form";
import { getCurrentUser } from "@/lib/auth";

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen">
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
        <div className="glass-nav mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3 text-primary">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-blue-950/10">
              <span className="material-symbols-outlined text-[21px]">sailing</span>
            </span>
            <span className="text-sm font-black uppercase tracking-tight sm:text-base">Surabaya-Madura</span>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {user ? (
              <>
                <Link href="/my-tickets" className="ghost-btn hidden rounded-xl px-4 py-2.5 text-sm font-bold sm:block">Tiket Saya</Link>
                <Link href="/account" className="primary-btn rounded-xl px-4 py-2.5 text-sm font-bold">Akun</Link>
              </>
            ) : (
              <>
                <Link href="/login" className="ghost-btn hidden rounded-xl px-4 py-2.5 text-sm font-bold sm:block">Login</Link>
                <Link href="/register" className="primary-btn rounded-xl px-4 py-2.5 text-sm font-bold">Book Now</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-24">
        <section className="site-gradient soft-grid relative overflow-hidden px-4 pb-36 pt-20 text-white sm:px-6 sm:pt-28">
          <span className="hero-orb left-[8%] top-28 h-24 w-24 bg-[#27F5F5]/30" />
          <span className="hero-orb right-[10%] top-40 h-36 w-36 bg-[#d6ed00]/15" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.22em] text-[#00a8b0] backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d6ed00]" />
                Smart Ferry Booking
              </div>
              <h1 className="text-5xl font-black leading-[.95] tracking-[-.055em] sm:text-6xl lg:text-8xl">
                Menyeberang lebih
                <span className="mt-2 block text-[#00a8b0]">simple & nyaman.</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-blue-100 sm:text-lg">
                Pesan tiket Surabaya–Madura, simpan boarding pass digital, dan nikmati alur perjalanan yang ringkas dari satu akun.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={user ? "/booking" : "/login"} className="accent-btn rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-wider">
                  Mulai Pesan <span className="ml-2">→</span>
                </Link>
                <Link href={user ? "/my-tickets" : "/register"} className="rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15">
                  {user ? "Lihat Tiket" : "Buat Akun"}
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-6 text-xs font-bold text-blue-100">
                <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[#00a8b0]">bolt</span>Booking cepat</span>
                <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[#00a8b0]">qr_code_2</span>QR digital</span>
                <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[#00a8b0]">verified</span>Verifikasi mudah</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="aesthetic-card relative overflow-hidden rounded-[2rem] p-5 text-primary">
                <div className="rounded-[1.5rem] bg-primary p-6 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[.25em] text-blue-200">Digital Boarding Pass</span>
                    <span className="rounded-full bg-[#d6ed00] px-2.5 py-1 text-[9px] font-black text-primary">READY</span>
                  </div>
                  <div className="mt-10 flex items-center gap-4">
                    <div>
                      <p className="text-3xl font-black">UJG</p>
                      <p className="text-[10px] uppercase tracking-wider text-blue-200">Ujung Port</p>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="h-px bg-white/20" />
                      <span className="relative -top-3 bg-primary px-2 text-[#00a8b0]">⛴</span>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black">KML</p>
                      <p className="text-[10px] uppercase tracking-wider text-blue-200">Kamal Port</p>
                    </div>
                  </div>
                  <div className="mt-10 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/8 p-3"><p className="text-[9px] uppercase text-blue-200">Status</p><p className="mt-1 text-sm font-black">Boarding Ready</p></div>
                    <div className="rounded-xl bg-white/8 p-3"><p className="text-[9px] uppercase text-blue-200">Access</p><p className="mt-1 text-sm font-black">QR Verified</p></div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between px-1 text-xs font-bold text-slate-500">
                  <span>Seamless journey</span><span className="text-[#0079ad]">Surabaya → Madura</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-20 mx-auto -mt-20 max-w-7xl px-4 sm:px-6">
          <SearchForm />
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[.25em] text-[#0079ad]">Designed for flow</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-primary sm:text-4xl">Semua terasa lebih ringan.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">Antarmuka dibuat fokus pada hal yang penting: pilih perjalanan, isi data, bayar, lalu gunakan QR saat boarding.</p>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {[
              ["01","Cari perjalanan","Tentukan rute, tanggal, dan jenis layanan dalam satu form.","search"],
              ["02","Selesaikan booking","Data profil otomatis membantu mempercepat pengisian.","edit_note"],
              ["03","Tunjukkan QR","Boarding pass tersimpan di akun dan siap diverifikasi.","qr_code_2"],
            ].map(([no,title,desc,icon]) => (
              <div key={no} className="interactive-card aesthetic-card rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-[#00a8b0]"><span className="material-symbols-outlined">{icon}</span></span>
                  <span className="text-xs font-black tracking-widest text-[#0079ad]">{no}</span>
                </div>
                <h3 className="mt-7 text-xl font-black text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6">
          <div className="site-gradient overflow-hidden rounded-[2rem] p-7 text-white sm:p-10">
            <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div>
                <p className="text-xs font-black uppercase tracking-[.25em] text-[#00a8b0]">Your next crossing</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight">Siap berangkat?</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">Simpan tiket digital Anda dan akses perjalanan tanpa antre panjang.</p>
              </div>
              <Link href={user ? "/booking" : "/register"} className="accent-btn rounded-2xl px-6 py-4 text-center text-sm font-black">Pesan Sekarang</Link>
            </div>
          </div>
        </section>
      </main>

      <nav className="glass-nav fixed bottom-3 left-3 right-3 z-50 flex justify-around rounded-2xl px-3 py-2 md:hidden">
        <Link href="/" className="flex flex-col items-center rounded-xl bg-primary px-5 py-2 text-white"><span className="material-symbols-outlined">explore</span><span className="text-[9px] font-black uppercase tracking-wider">Explore</span></Link>
        <Link href={user ? "/my-tickets" : "/login"} className="flex flex-col items-center px-5 py-2 text-primary"><span className="material-symbols-outlined">confirmation_number</span><span className="text-[9px] font-black uppercase tracking-wider">Tiket</span></Link>
        <Link href={user ? "/account" : "/login"} className="flex flex-col items-center px-5 py-2 text-primary"><span className="material-symbols-outlined">person</span><span className="text-[9px] font-black uppercase tracking-wider">Akun</span></Link>
      </nav>
    </div>
  );
}
