// app/api/photos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// IMPORTANTE: sin esto, Next.js puede cachear la respuesta de este GET
// (Full Route Cache) y servir siempre el mismo resultado hasta que el
// proceso se reinicie (por eso "solo se veía tras pm2 restart"). Estas
// dos líneas fuerzan a que cada request consulte la base de datos real.
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

// Soporta un filtro opcional por sección: /api/photos?section=our-team
// Si no se pasa "section", se comporta exactamente igual que antes (trae
// todo), para no romper el panel de admin que necesita ver todos los
// archivos sin importar la sección.
export async function GET(req: NextRequest) {
  const section = req.nextUrl.searchParams.get("section");

  const photos = await prisma.photo.findMany({
    where: section ? { section } : undefined,
    orderBy: { order: "asc" },
  });

  return NextResponse.json(photos, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}