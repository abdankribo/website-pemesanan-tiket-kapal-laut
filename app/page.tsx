import Link from "next/link";
import SearchForm from "@/components/search-form";

export default function LandingPage() {
  return (
    <div>
      <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-xl shadow-[0_8px_24px_-2px_rgba(25,28,30,0.06)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-primary">
            <span className="material-symbols-outlined">sailing</span>
            <span className="text-sm uppercase tracking-tight sm:text-lg">Surabaya-Madura</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-full px-4 py-2 text-sm font-bold text-primary hover:bg-slate-100">Login</Link>
            <Link href="/register" className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-container">Register</Link>
          </div>
        </div>
      </header>

      <main className="pt-24">
        <section className="relative min-h-[580px] overflow-hidden bg-primary">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(37,99,235,.45),transparent_40%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
            <div className="text-white">
              <p className="mb-4 text-xs font-black uppercase tracking-[.3em] text-primary-fixed-dim">Fast • Simple • Digital</p>
              <h1 className="text-5xl font-black tracking-tight sm:text-7xl">Cross the Strait.<br /><span className="text-secondary-container">Simply.</span></h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-blue-100 sm:text-lg">Pesan tiket kapal Surabaya-Madura secara digital, pilih layanan penumpang atau kendaraan, lalu gunakan tiket QR untuk proses check-in.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="rounded-xl bg-secondary-container px-6 py-4 text-sm font-black uppercase tracking-widest text-primary">Book a Ticket</Link>
                <Link href="/register" className="rounded-xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-bold text-white backdrop-blur">Create Account</Link>
              </div>
            </div>
            <div className="rounded-[2rem] bg-white p-3 shadow-2xl">
              <SearchForm />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-black tracking-tight text-primary sm:text-3xl">Premium Experience</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-12 md:h-[500px]">
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 md:col-span-7">
              <img className="h-full w-full object-cover opacity-80" alt="Ferry lounge" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnu7rroYhfi_49yIY1nVpjlsFgYYWJiDMhpbf78ltGG9kihYXg_tK2Rq6xwF7iYFXUZTxuIROUblyCbr5S0jzhgxHtsVpZamLjb8jefjFE50gC8ihKBORmJ7VuUgIbt_vYVgs19eO8H0wYr9_mSjQaaDPLo2QGHKsQQuJk3NlSpWgmTOxvUP2K3z-UL5g5QedvLARI2tCkuhkZo4ItTFk6cBCuRUd328CZVrVqNJo0dOilEA6WNs4YUaWb2ig21HkXTrmpwghigDPN" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <span className="mb-4 inline-block rounded-full bg-primary-fixed-dim px-3 py-1 text-[10px] font-black uppercase text-primary">New Fleet</span>
                <h3 className="text-3xl font-bold text-white">Comfort Class<br />Now Available</h3>
                <p className="mt-2 max-w-sm text-sm text-blue-100">Digital boarding experience for major crossings.</p>
              </div>
            </div>
            <div className="flex flex-col gap-6 md:col-span-5">
              <div className="flex-1 rounded-2xl bg-orange-50 p-8">
                <span className="material-symbols-outlined text-4xl text-secondary">timer</span>
                <h3 className="mt-4 text-xl font-bold uppercase tracking-tight text-secondary">Fast Loading</h3>
                <p className="mt-2 text-sm text-slate-600">Dedicated vehicle ramps and streamlined boarding.</p>
              </div>
              <div className="flex-1 rounded-2xl bg-white p-8 shadow-sm">
                <span className="material-symbols-outlined text-4xl text-primary">qr_code_2</span>
                <h3 className="mt-4 text-xl font-bold uppercase tracking-tight text-primary">Digital Check-in</h3>
                <p className="mt-2 text-sm text-slate-600">Use your QR ticket for verification at the gate.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-32 sm:px-6">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-[.2em] text-secondary">Strategic Connection</p>
              <h2 className="text-4xl font-bold leading-tight text-primary">The Gateway to<br />Madura Island</h2>
              <p className="mt-6 leading-7 text-slate-600">Pesan perjalanan lintas Surabaya-Madura dengan alur digital yang sederhana dan tiket yang tersimpan di akun Anda.</p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-100 px-6 py-4"><b className="block text-2xl text-primary">24/7</b><span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Operation</span></div>
                <div className="rounded-xl bg-slate-100 px-6 py-4"><b className="block text-2xl text-primary">15m</b><span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Avg. Trip</span></div>
              </div>
            </div>
            <div className="h-80 overflow-hidden rounded-3xl border-8 border-white shadow-2xl">
              <img className="h-full w-full object-cover" alt="Madura Strait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCE-jTsVnEoMo9hF4_KVmDWKrvT3gXJmOhhdy22yEV27JQq_VlZgFAOKNoOWCJUlZfhpgPIEB3H_Zjf3bCK3ryMRcRLYyfIVgfZokJVIkFHrG429cEq9UxrbimLleCzCm1QKtdWb445pqlyw9kbz8cvFx-fAhvC5q2X8BJfuZyjqOTLoMINct-_4m4DRalBYcHNQCFwownZxecKFogdSSW5O6uyXIFkEFLpb5VQwgDpiiV3_6tTp0Q2a8xcftH9RMD8-tX3naKKb1j" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}