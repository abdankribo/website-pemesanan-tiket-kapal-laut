import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request:Request){
 const user=await getCurrentUser(); if(!user)return NextResponse.redirect(new URL("/login",request.url));
 const form=await request.formData(); const method=String(form.get("payment_method")||""); const draftId=String(form.get("draft_id")||"");
 if(!["mandiri","bca","gopay"].includes(method)||!draftId)return NextResponse.redirect(new URL("/booking?error=Data%20pembayaran%20tidak%20valid",request.url));
 const draft=await prisma.bookingDraft.findFirst({where:{id:draftId,userId:user.id}});
 if(!draft||draft.expiresAt<new Date())return NextResponse.redirect(new URL("/booking?error=Booking%20sudah%20kedaluwarsa",request.url));
 const p=draft.payload as Record<string,unknown>;
 const ticket=await prisma.$transaction(async tx=>{
   const created=await tx.ticket.create({data:{userId:user.id,passengerName:String(p.passengerName),passengerNik:String(p.passengerNik),passengerPhone:String(p.passengerPhone),origin:String(p.origin),destination:String(p.destination),departureDate:new Date(String(p.departureDate)+"T00:00:00"),vehicle:String(p.vehicle),vehiclePlate:p.vehiclePlate?String(p.vehiclePlate):null,status:"booked"}});
   await tx.bookingDraft.delete({where:{id:draft.id}});
   return created;
 });
 return NextResponse.redirect(new URL("/ticket?ticket="+ticket.ticketId,request.url));
}
