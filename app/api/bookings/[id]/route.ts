import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const booking = await prisma.booking.update({
    where: {
      id: Number(params.id),
    },
    data: {
      tripStatus: body.tripStatus,
      driverNotes: body.driverNotes,
    },
  });

  return NextResponse.json(booking);
}