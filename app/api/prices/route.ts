import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const prices = await prisma.price.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return NextResponse.json(prices);
}

export async function POST(req: Request) {
  const body = await req.json();

  const price = await prisma.price.create({
    data: {
      fromZone: body.fromZone,
      toZone: body.toZone,
      suvPrice: Number(body.suvPrice),
      vanPrice: Number(body.vanPrice),
      sprinterPrice: Number(body.sprinterPrice),
    },
  });

  return NextResponse.json(price);
}