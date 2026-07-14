//app/api/vehicles/route.ts

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const vehicles = await prisma.vehicle.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(vehicles)
}

export async function POST(req: Request) {
  const body = await req.json()
  const vehicle = await prisma.vehicle.create({
    data: {
      name: body.name,
      capacity: Number(body.capacity),
      active: body.active ?? true,
      image: body.image || null,
    }
  })
  return NextResponse.json(vehicle)
}