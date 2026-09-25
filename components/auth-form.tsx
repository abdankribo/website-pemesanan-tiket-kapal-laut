"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithCredentials } from "@/lib/client-auth";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await signInWithCredentials(email, password, remember);
      if (result.ok) router.push("/booking");
      else setError(result.error || "Login gagal.");
    } catch {
      setError("Tidak dapat terhubung ke server. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return <form onSubmit={submit} className="space-y-5 px-5 py-6 sm:px-8 sm:py-8">
    {params.get("error") && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{params.get("error")}</div>}
    {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
    <Field label="Email"><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required /></Field>
    <Field label="Password"><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required /><a href="/forgot-password" className="mt-2 inline-block text-xs font-semibold text-primary">Lupa password?</a></Field>
    <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} /> Ingat saya di perangkat ini</label>
    <button disabled={busy} className="w-full rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-white disabled:opacity-50">{busy ? "Memproses..." : "Masuk dan lanjutkan"}</button>
    <div className="flex items-center gap-3 text-xs text-slate-500"><span className="h-px flex-1 bg-slate-200"/>atau<span className="h-px flex-1 bg-slate-200"/></div>
    <a href="/api/auth/google/start?callbackUrl=/booking" className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-bold text-slate-800 hover:bg-slate-50"><span className="font-black text-[#4285F4]">G</span> Lanjutkan dengan Google</a>
    <p className="text-center text-sm text-slate-500">Belum punya akun? <a href="/register" className="font-bold text-primary">Buat akun</a></p>
  </form>;
}

export function RegisterForm() {
  const router = useRouter();
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [confirmation,setConfirmation]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    if (password !== confirmation) {
      setError("Konfirmasi password tidak sama.");
      setBusy(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, email, password}),
        credentials: "same-origin",
        cache: "no-store",
        signal: controller.signal,
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : {};

      if (!response.ok) {
        setError(data.error || "Registrasi gagal. Coba lagi.");
        return;
      }

      router.push("/booking");
      router.refresh();
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setError("Server terlalu lama merespons. Periksa koneksi/database lalu coba lagi.");
      } else {
        setError("Tidak dapat terhubung ke server. Coba lagi.");
      }
    } finally {
      window.clearTimeout(timeout);
      setBusy(false);
    }
  }

  return <form onSubmit={submit} className="space-y-5 px-5 py-6 sm:px-8 sm:py-8">
    {error&&<div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
    <Field label="Nama lengkap"><input className="input" value={name} onChange={e=>setName(e.target.value)} autoComplete="name" required /></Field>
    <Field label="Email"><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required /></Field>
    <Field label="Password"><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password" minLength={8} required /></Field>
    <Field label="Konfirmasi password"><input className="input" type="password" value={confirmation} onChange={e=>setConfirmation(e.target.value)} autoComplete="new-password" minLength={8} required /></Field>
    <button disabled={busy} className="w-full rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-white disabled:opacity-50">{busy?"Membuat akun...":"Buat akun dan lanjutkan"}</button>
    <p className="text-center text-sm text-slate-500">Sudah punya akun? <a href="/login" className="font-bold text-primary">Masuk</a></p>
  </form>;
}

function Field({label,children}:{label:string;children:React.ReactNode}){return <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>{children}</label>}
