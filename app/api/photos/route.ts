// app/api/photos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { url, section, caption } = await req.json();
    if (!url || !section) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }
    const photo = await prisma.photo.create({
      data: {
        url,
        section,
        caption: caption || null,
        order: 0,
      },
    });
    return NextResponse.json(photo);
  } catch (error) {
    console.error("Error saving photo:", error);
    return NextResponse.json({ error: "Error al guardar en BD" }, { status: 500 });
  }
}

export async function GET() {
  const photos = await prisma.photo.findMany({
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(photos);
}