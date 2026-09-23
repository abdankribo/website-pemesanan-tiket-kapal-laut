"use client";
import { useEffect } from "react";

export default function SessionHeartbeat() {
  useEffect(() => {
    const ping = () => fetch("/api/session/heartbeat", { method: "POST", credentials: "same-origin" }).catch(() => {});
    ping();
    const id = window.setInterval(ping, 5 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);
  return null;
}
