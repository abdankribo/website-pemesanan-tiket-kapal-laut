import { NextResponse } from "next/server";
import { requireSameOrigin } from "@/lib/csrf";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request:Request){
  try { requireSameOrigin(request); } catch { return NextResponse.redirect(new URL("/account?error=invalid", request.url)); }
  const user=await getCurrentUser(); if(!user) return NextResponse.redirect(new URL("/login",request.url));
  const form=await request.formData();
  const name=String(form.get("name")||"").trim(), email=String(form.get("email")||"").trim().toLowerCase();
  const phone=String(form.get("phone")||"").trim(), nik=String(form.get("nik")||"").trim(), birthDate=String(form.get("birth_date")||"").trim();
  if(name.length<1||name.length>100||!/^\S+@\S+\.\S+$/.test(email)||!/^(08)\d{8,11}$/.test(phone)||!/^[0-9]{16}$/.test(nik)||!birthDate) return NextResponse.redirect(new URL("/account?error=invalid",request.url));
  const date=new Date(birthDate+"T00:00:00"); if(Number.isNaN(date.getTime())||date>=new Date()) return NextResponse.redirect(new URL("/account?error=invalid",request.url));
  const existing=await prisma.user.findFirst({where:{email,id:{not:user.id}}}); if(existing) return NextResponse.redirect(new URL("/account?error=email",request.url));
  await prisma.user.update({where:{id:user.id},data:{name,email,phone,nik,birthDate:date}});
  return NextResponse.redirect(new URL("/account?saved=1",request.url));
}
