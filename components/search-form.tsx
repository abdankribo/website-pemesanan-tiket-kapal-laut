"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchForm() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [origin, setOrigin] = useState("ujung");
  const [destination, setDestination] = useState("kamal");
  const [date, setDate] = useState(today);
  const [serviceType, setServiceType] = useState("passenger");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (origin === destination) return setError("Origin dan destination harus berbeda.");
    if (!date || date < today) return setError("Tanggal keberangkatan tidak valid.");
    setError("");
    const q = new URLSearchParams({ origin, destination, departureDate: date, serviceType });
    router.push(`/api/search?${q.toString()}`);
  }

  return (
    <form onSubmit={submit} className="aesthetic-card rounded-[1.8rem] p-5 sm:p-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[.25em] text-[#00B4FF]">Book your crossing</p>
          <h2 className="mt-1 text-2xl font-black text-primary">Ke mana hari ini?</h2>
        </div>
        <span className="hidden rounded-full bg-[#E0FF00]/40 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary sm:inline-flex">Fast booking</span>
      </div>
      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-xs font-bold text-red-700">{error}</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Dari"><select value={origin} onChange={e => { setOrigin(e.target.value); if (e.target.value === destination) setDestination(e.target.value === "ujung" ? "kamal" : "ujung"); }} className="input"><option value="ujung">Ujung Port</option><option value="kamal">Kamal Port</option></select></Field>
        <Field label="Ke"><select value={destination} onChange={e => { setDestination(e.target.value); if (e.target.value === origin) setOrigin(e.target.value === "ujung" ? "kamal" : "ujung"); }} className="input"><option value="kamal">Kamal Port</option><option value="ujung">Ujung Port</option></select></Field>
        <Field label="Tanggal"><input className="input" type="date" min={today} value={date} onChange={e => setDate(e.target.value)} required /></Field>
        <Field label="Layanan"><select className="input" value={serviceType} onChange={e => setServiceType(e.target.value)}><option value="passenger">Passenger Only</option><option value="motor">Motor</option><option value="car">Mobil</option></select></Field>
      </div>
      <button className="primary-btn mt-5 w-full rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest sm:mt-6">Lanjut ke Booking <span className="ml-1">→</span></button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</span>{children}</label>;
}
