import { NextResponse } from "next/server";
import { requireSameOrigin } from "@/lib/csrf";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const prices={passenger:10000,motor:15000,car:20000} as const;
function validDate(s:string){const d=new Date(s+"T00:00:00"); return !Number.isNaN(d.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(s);}
export async function POST(request:Request){
 try { requireSameOrigin(request); } catch { return NextResponse.json({error:"Permintaan tidak valid"},{status:403}); }
 const user=await getCurrentUser(); if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
 let b:any; try{b=await request.json()}catch{return NextResponse.json({error:"Payload tidak valid"},{status:400})}
 const name=String(b.passengerName||"").trim(),nik=String(b.passengerNik||""),phone=String(b.passengerPhone||"");
 const vehicle=String(b.vehicle||"passenger"),plate=String(b.vehiclePlate||"").trim().toUpperCase();
 const origin=String(b.origin||"").toLowerCase();
 const destination=String(b.destination||"").toLowerCase();
 const validRoute=(origin==="ujung"&&destination==="kamal")||(origin==="kamal"&&destination==="ujung");
 const serviceType=String(b.serviceType||"passenger");
 if(name.length>100||!name||!/^[0-9]{16}$/.test(nik)||!/^08\d{8,11}$/.test(phone)||!(vehicle in prices)||!validDate(String(b.departureDate))||!["passenger","motor","car"].includes(serviceType)||serviceType!==vehicle||((vehicle==="motor"||vehicle==="car")&&!/^[A-Z]{1,2} ?\d{4} ?[A-Z]+$/.test(plate))) return NextResponse.json({error:"Data booking tidak valid"},{status:400});
 const departure=new Date(String(b.departureDate)+"T00:00:00"); const today=new Date(); today.setHours(0,0,0,0);
 if(departure<today)return NextResponse.json({error:"Tanggal keberangkatan sudah lewat"},{status:400});
 const draft=await prisma.bookingDraft.create({data:{userId:user.id,payload:{origin,destination,departureDate:String(b.departureDate),passengerName:name,passengerNik:nik,passengerPhone:phone,vehicle,vehiclePlate:vehicle==="passenger"?null:plate,serviceType,basePrice:prices[vehicle as keyof typeof prices]},expiresAt:new Date(Date.now()+30*60*1000)}});
 return NextResponse.json({ok:true,draftId:draft.id,total:prices[vehicle as keyof typeof prices]+5000});
}
