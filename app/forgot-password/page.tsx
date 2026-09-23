import Link from "next/link";

export default function ForgotPasswordPage({searchParams}:{searchParams:Promise<{sent?:string}>}) {
  return <main className="min-h-screen bg-slate-100 px-4 py-8 sm:flex sm:items-center sm:justify-center">
    <section className="mx-auto w-full max-w-md">
      <Link href="/login" className="mb-8 inline-flex text-sm font-bold text-primary">← Kembali ke login</Link>
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-black text-primary">Lupa Password</h1>
        <p className="mt-2 text-sm text-slate-500">Masukkan email akun Anda untuk menerima link reset password.</p>
        <form action="/api/auth/forgot-password" method="POST" className="mt-6 space-y-4">
          <input className="input" name="email" type="email" placeholder="nama@email.com" required />
          <button className="w-full rounded-xl bg-primary px-5 py-3 font-bold text-white">Kirim Link Reset</button>
        </form>
        <p className="mt-5 text-xs text-slate-500">Jika email terdaftar, link reset akan dikirim. Untuk deployment production, isi RESEND_API_KEY dan email pengirim.</p>
      </div>
    </section>
  </main>;
}
