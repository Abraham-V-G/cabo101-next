import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.price.delete({
    where: {
      id: Number(params.id),
    },
  });

  return NextResponse.json({
    success: true,
  });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const price = await prisma.price.update({
    where: {
      id: Number(params.id),
    },
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