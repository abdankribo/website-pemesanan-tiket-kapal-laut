import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request:Request){
  const user=await getCurrentUser();
  if(!user) return NextResponse.redirect(new URL("/login",request.url));
  const form=await request.formData();
  if(!form.get("payment_method")) return NextResponse.redirect(new URL("/payment?error=Metode%20pembayaran%20wajib%20dipilih",request.url));
  let p:Record<string,string>;
  try { p=JSON.parse(String(form.get("payload")||"{}")); } catch { return NextResponse.redirect(new URL("/booking",request.url)); }
  if(!p.passengerName||!/^\d{16}$/.test(p.passengerNik||"")||!/^08\d{8,11}$/.test(p.passengerPhone||"")||!p.departureDate) return NextResponse.redirect(new URL("/booking",request.url));
  const ticket=await prisma.ticket.create({data:{
    userId:user.id, passengerName:p.passengerName, passengerNik:p.passengerNik, passengerPhone:p.passengerPhone,
    origin:p.origin||"ujung", destination:p.destination||"kamal", departureDate:new Date(p.departureDate),
    vehicle:p.vehicle||"passenger", vehiclePlate:p.vehiclePlate||null, status:"booked"
  },select:{ticketId:true}});
  return NextResponse.redirect(new URL("/ticket?ticket="+ticket.ticketId,request.url));
}
