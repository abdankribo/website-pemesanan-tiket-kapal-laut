import type { Metadata } from "next";
import "./globals.css";
import SessionHeartbeat from "@/components/session-heartbeat";

export const metadata: Metadata = {
  title: "Surabaya-Madura",
  description: "Pemesanan tiket kapal Surabaya-Madura",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>{children}<SessionHeartbeat />
      </body>
    </html>
  );
}