// app/api/popular-transfers/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const airport = await prisma.zone.findFirst({ where: { isAirport: true } });
  if (!airport) return NextResponse.json([]);

  const populars = await prisma.popularTransfer.findMany({
    where: { active: true },
    include: { zone: true, vehicle: true },
    orderBy: { sortOrder: 'asc' },
  });

  const transfers = await Promise.all(
    populars.map(async (item) => {
      const price = await prisma.price.findFirst({
        where: {
          fromZone: airport.slug,
          toZone: item.zone.slug,
          vehicleId: item.vehicleId,
        },
      });
      const roundTripPrice = price?.roundTrip ?? null;
      return {
        title: item.zone.name,
        slug: item.zone.slug,
        subtitle: item.travelTime,
        price: roundTripPrice ? `$${roundTripPrice} USD` : 'Consultar',
        tag: null,
        image: item.image || `/images/${item.zone.name.toLowerCase().replace(/ /g, '-')}.jpg`, // fallback
      };
    })
  );

  const availableTransfers = transfers.filter(t => t.price !== 'Consultar');
  return NextResponse.json(availableTransfers);
}