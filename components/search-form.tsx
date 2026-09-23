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
    router.push(`/booking?${q.toString()}`);
  }

  return (
    <form onSubmit={submit} className="rounded-[1.6rem] bg-white p-5 sm:p-7">
      <p className="text-[10px] font-black uppercase tracking-[.25em] text-secondary">Book your crossing</p>
      <h2 className="mt-2 text-2xl font-black text-primary">Where are you going?</h2>
      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700">{error}</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Origin">
          <select value={origin} onChange={e => { setOrigin(e.target.value); if (e.target.value === destination) setDestination(e.target.value === "ujung" ? "kamal" : "ujung"); }} className="input">
            <option value="ujung">Ujung Port</option><option value="kamal">Kamal Port</option>
          </select>
        </Field>
        <Field label="Destination">
          <select value={destination} onChange={e => { setDestination(e.target.value); if (e.target.value === origin) setOrigin(e.target.value === "ujung" ? "kamal" : "ujung"); }} className="input">
            <option value="kamal">Kamal Port</option><option value="ujung">Ujung Port</option>
          </select>
        </Field>
        <Field label="Departure Date">
          <input className="input" type="date" min={today} value={date} onChange={e => setDate(e.target.value)} required />
        </Field>
        <Field label="Service Type">
          <select className="input" value={serviceType} onChange={e => setServiceType(e.target.value)}>
            <option value="passenger">Passenger Only</option><option value="vehicle">Vehicle (Car/Bike)</option>
          </select>
        </Field>
      </div>
      <button className="mt-6 w-full rounded-xl bg-primary px-5 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-primary-container">Continue to Booking</button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</span>{children}</label>;
}