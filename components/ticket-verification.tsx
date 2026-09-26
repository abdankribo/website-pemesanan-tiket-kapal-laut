"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type VerificationStatus = "checking" | "verified" | "already-verified" | "expired" | "cancelled" | "error";

type Props = {
  ticketId: string;
  passengerName: string;
  origin: string;
  destination: string;
  departureDate: string;
  vehicle: string;
  vehiclePlate: string | null;
  initialStatus: string;
  initialScannedAt: string | null;
};

export function TicketVerification({
  ticketId,
  passengerName,
  origin,
  destination,
  departureDate,
  vehicle,
  vehiclePlate,
  initialStatus,
  initialScannedAt,
}: Props) {
  const [status, setStatus] = useState<VerificationStatus>(
    initialStatus === "scanned" ? "already-verified" : "checking",
  );
  const [message, setMessage] = useState(
    initialStatus === "scanned"
      ? "Tiket sudah berhasil diverifikasi sebelumnya."
      : "Sedang memverifikasi tiket...",
  );
  const [scannedAt, setScannedAt] = useState(initialScannedAt);

  useEffect(() => {
    if (initialStatus === "scanned") return;

    const controller = new AbortController();

    async function verify() {
      try {
        const response = await fetch("/api/ticket/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          cache: "no-store",
          body: JSON.stringify({ ticketId }),
          signal: controller.signal,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          setStatus("error");
          setMessage(data.error || "Tiket gagal diverifikasi.");
          return;
        }

        setScannedAt(data.ticket?.scannedAt || null);

        if (data.status === "expired") {
          setStatus("expired");
          setMessage(data.message || "Tiket sudah kedaluwarsa.");
        } else if (data.status === "cancelled") {
          setStatus("cancelled");
          setMessage(data.message || "Tiket sudah dibatalkan.");
        } else if (data.alreadyVerified) {
          setStatus("already-verified");
          setMessage(data.message || "Tiket sudah berhasil diverifikasi sebelumnya.");
        } else {
          setStatus("verified");
          setMessage(data.message || "Tiket berhasil diverifikasi.");
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
        setMessage("Tidak dapat menghubungi server verifikasi.");
      }
    }

    verify();
    return () => controller.abort();
  }, [initialStatus, ticketId]);

  const verified = status === "verified" || status === "already-verified";
  const invalid = status === "expired" || status === "cancelled" || status === "error";

  return (
    <main className="min-h-screen bg-surface px-4 py-12">
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[.3em] text-secondary">
          Ticket Verification
        </p>

        <div
          className={
            "mt-3 rounded-2xl p-5 " +
            (verified
              ? "bg-green-50"
              : invalid
                ? "bg-red-50"
                : "bg-slate-50")
          }
        >
          <h1
            className={
              "text-3xl font-black " +
              (verified
                ? "text-green-700"
                : invalid
                  ? "text-red-700"
                  : "text-primary")
            }
          >
            {status === "checking"
              ? "Memverifikasi..."
              : verified
                ? "Tiket Berhasil Diverifikasi"
                : status === "expired"
                  ? "Tiket Kedaluwarsa"
                  : status === "cancelled"
                    ? "Tiket Dibatalkan"
                    : "Verifikasi Gagal"}
          </h1>
          <p className="mt-2 text-sm text-slate-600">{message}</p>
        </div>

        <div className="mt-6 space-y-3 text-sm">
          <p><b>Passenger:</b> {passengerName}</p>
          <p><b>Route:</b> {origin} → {destination}</p>
          <p><b>Departure:</b> {departureDate}</p>
          <p><b>Vehicle:</b> {vehiclePlate || vehicle || "Tidak ada"}</p>
          <p><b>Ticket ID:</b> <span className="break-all">{ticketId}</span></p>
          {scannedAt && (
            <p>
              <b>Diverifikasi:</b>{" "}
              {new Date(scannedAt).toLocaleString("id-ID")}
            </p>
          )}
        </div>

        {verified && (
          <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm font-semibold text-green-800">
            Tiket ini sekarang masuk ke <b>Riwayat Pesanan</b> dan tidak lagi berada di Tiket Aktif.
          </div>
        )}

        <Link
          href="/my-tickets"
          className="mt-7 inline-block rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
        >
          Lihat Tiket Saya
        </Link>
      </div>
    </main>
  );
}
