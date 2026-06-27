import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const photos = await prisma.photo.findMany({
    orderBy: [{ section: "asc" }, { order: "asc" }],
  });
  return NextResponse.json(photos);
}

export async function POST(req: NextRequest) {
  const { url, section, caption } = await req.json();
  const maxOrder = await prisma.photo.aggregate({
    where: { section },
    _max: { order: true },
  });
  const order = (maxOrder._max.order ?? -1) + 1;

  const photo = await prisma.photo.create({
    data: {
      url,
      section,
      caption,
      order,
    },
  });
  return NextResponse.json(photo);
}