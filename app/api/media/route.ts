import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const photos = await prisma.photo.findMany({
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(photos);
}