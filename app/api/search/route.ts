import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request:Request){
 const user=await getCurrentUser(); if(!user)return NextResponse.redirect(new URL("/login",request.url));
 const u=new URL(request.url), origin=u.searchParams.get("origin")||"", destination=u.searchParams.get("destination")||"", departureDate=u.searchParams.get("departureDate")||"", serviceType=u.searchParams.get("serviceType")||"passenger";
 const today=new Date(); today.setHours(0,0,0,0); const d=new Date(departureDate+"T00:00:00");
 if(!["ujung","kamal"].includes(origin)||!["ujung","kamal"].includes(destination)||origin===destination||!["passenger","motor","car"].includes(serviceType)||!/^\d{4}-\d{2}-\d{2}$/.test(departureDate)||Number.isNaN(d.getTime())||d<today)return NextResponse.redirect(new URL("/?error=Data%20pencarian%20tidak%20valid",request.url));
 const q=new URLSearchParams({origin,destination,departureDate,serviceType});
 return NextResponse.redirect(new URL("/booking?"+q.toString(),request.url));
}
