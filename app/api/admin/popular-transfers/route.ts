import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const zones = await prisma.zone.findMany({
    where: { isAirport: false },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      isPopular: true,
      travelTimeFromAirport: true,
      sortOrder: true,
    },
  });
  return NextResponse.json(zones);
}

export async function PUT(req: Request) {
  const { zones } = await req.json(); // espera un array de zonas actualizadas
  try {
    for (const zone of zones) {
      await prisma.zone.update({
        where: { id: zone.id },
        data: {
          isPopular: zone.isPopular,
          travelTimeFromAirport: zone.travelTimeFromAirport || null,
          sortOrder: zone.sortOrder,
        },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error updating zones' }, { status: 500 });
  }
}