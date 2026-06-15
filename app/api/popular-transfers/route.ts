//app/api/popular-transfers/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const airportZone = await prisma.zone.findFirst({ where: { isAirport: true } });
    if (!airportZone) {
      return NextResponse.json({ error: 'Airport zone not found' }, { status: 404 });
    }

    const popularZones = await prisma.zone.findMany({
      where: { isAirport: false, isPopular: true },
      orderBy: { sortOrder: 'asc' },
    });

    const defaultVehicle = await prisma.vehicle.findFirst({
      where: { active: true },
      orderBy: { capacity: 'asc' },
    });

    if (!defaultVehicle) {
      return NextResponse.json({ error: 'No active vehicles found' }, { status: 404 });
    }

    const transfers = await Promise.all(
      popularZones.map(async (zone) => {
        const price = await prisma.price.findFirst({
          where: {
            fromZone: airportZone.slug,
            toZone: zone.slug,
            vehicleId: defaultVehicle.id,
          },
        });
        const reversePrice = !price
          ? await prisma.price.findFirst({
              where: {
                fromZone: zone.slug,
                toZone: airportZone.slug,
                vehicleId: defaultVehicle.id,
              },
            })
          : null;
        const roundTripPrice = price?.roundTrip ?? reversePrice?.roundTrip ?? null;

        return {
          title: zone.name,
          slug: zone.slug,
          subtitle: zone.travelTimeFromAirport || 'Private transfer',
          price: roundTripPrice ? `$${roundTripPrice} USD` : 'Consultar',
          tag: zone.isPopular ? 'Most Popular' : null,
          image: `/images/${zone.name.toLowerCase().replace(/ /g, ' ')}.jpg`,
        };
      })
    );

    const availableTransfers = transfers.filter(t => t.price !== 'Consultar');
    return NextResponse.json(availableTransfers);
  } catch (error) {
    console.error('Error fetching popular transfers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}