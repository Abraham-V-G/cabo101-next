import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.zone.delete({
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

  const zone = await prisma.zone.update({
    where: {
      id: Number(params.id),
    },
    data: {
      name: body.name,
    },
  });

  return NextResponse.json(zone);
}