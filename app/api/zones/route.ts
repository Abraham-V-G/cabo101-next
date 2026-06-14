import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const zones = await prisma.zone.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json(zones);
}

export async function POST(req: Request) {
  const body = await req.json();

  const zone = await prisma.zone.create({
    data: {
      name: body.name,
    },
  });

  return NextResponse.json(zone);
}