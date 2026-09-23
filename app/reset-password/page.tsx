import Link from "next/link";

export default async function ResetPasswordPage({searchParams}:{searchParams:Promise<{token?:string;email?:string}>}) {
  const p=await searchParams;
  return <main className="min-h-screen bg-slate-100 px-4 py-8 sm:flex sm:items-center sm:justify-center">
    <section className="mx-auto w-full max-w-md">
      <Link href="/login" className="mb-8 inline-flex text-sm font-bold text-primary">← Kembali ke login</Link>
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-black text-primary">Reset Password</h1>
        <form action="/api/auth/reset-password" method="POST" className="mt-6 space-y-4">
          <input type="hidden" name="token" value={p.token||""}/>
          <input className="input" name="email" type="email" defaultValue={p.email||""} placeholder="nama@email.com" required />
          <input className="input" name="password" type="password" placeholder="Password baru (min. 8 karakter)" minLength={8} required />
          <input className="input" name="password_confirmation" type="password" placeholder="Ulangi password" minLength={8} required />
          <button className="w-full rounded-xl bg-primary px-5 py-3 font-bold text-white">Ubah Password</button>
        </form>
      </div>
    </section>
  </main>;
}
