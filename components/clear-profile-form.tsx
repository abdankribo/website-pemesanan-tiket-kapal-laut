"use client";

import { FormEvent, useState } from "react";

export default function ClearProfileForm() {
  const [pending, setPending] = useState(false);
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm("Hapus data profil dan tiket Anda?")) {
      event.preventDefault();
      return;
    }
    setPending(true);
  }
  return (
    <form action="/api/profile/clear" method="post" onSubmit={onSubmit}>
      <button type="submit" disabled={pending} className="rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-50">
        {pending ? "Memproses..." : "Hapus data profil"}
      </button>
    </form>
  );
}
