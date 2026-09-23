import { NextResponse } from "next/server";
import { requireSameOrigin } from "@/lib/csrf";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request:Request){
  const user=await getCurrentUser(); if(!user) return NextResponse.redirect(new URL("/login",request.url));
  await prisma.$transaction([
    prisma.ticket.deleteMany({where:{userId:user.id}}),
    prisma.user.update({where:{id:user.id},data:{phone:null,nik:null,birthDate:null}})
  ]);
  return NextResponse.redirect(new URL("/account?cleared=1",request.url));
}
