import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function AccountPage(){
 const user=await getCurrentUser(); if(!user) redirect("/login");
 return <main className="min-h-screen bg-surface px-4 py-10"><div className="mx-auto max-w-xl"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.3em] text-secondary">Account</p><h1 className="text-3xl font-black text-primary">Your Profile</h1></div><Link href="/my-tickets" className="rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-white">My Tickets</Link></div><div className="mt-8 rounded-3xl bg-white p-6 shadow-sm"><dl className="space-y-4 text-sm"><div><dt className="text-slate-500">Nama</dt><dd className="font-bold">{user.name}</dd></div><div><dt className="text-slate-500">Email</dt><dd className="font-bold">{user.email}</dd></div><div><dt className="text-slate-500">Nomor HP</dt><dd className="font-bold">{user.phone||"Belum diisi"}</dd></div><div><dt className="text-slate-500">NIK</dt><dd className="font-bold">{user.nik||"Belum diisi"}</dd></div><div><dt className="text-slate-500">Tanggal lahir</dt><dd className="font-bold">{user.birthDate?.toLocaleDateString("id-ID")||"Belum diisi"}</dd></div></dl><form action="/api/auth/logout" method="POST" className="mt-8"><button className="rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-700">Logout</button></form></div></div></main>;
}
