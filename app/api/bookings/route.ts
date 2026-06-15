//app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const bookings = await prisma.booking.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      payments: true,
    },
  });

  return NextResponse.json(bookings);
}