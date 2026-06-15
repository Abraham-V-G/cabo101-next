//app/api/admin/popular-transfers/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Lista de viajes populares con sus relaciones
export async function GET() {
  const popularTransfers = await prisma.popularTransfer.findMany({
    include: {
      zone: true,
      vehicle: true,
    },
    orderBy: { sortOrder: 'asc' },
  });
  return NextResponse.json(popularTransfers);
}

// POST: Crear un nuevo viaje popular
export async function POST(req: Request) {
  const body = await req.json();
  const { zoneId, vehicleId, travelTime, sortOrder, active } = body;

  // Validar que no exista ya la zona en popular
  const existing = await prisma.popularTransfer.findUnique({
    where: { zoneId },
  });
  if (existing) {
    return NextResponse.json({ error: 'Esta zona ya está en la lista de populares' }, { status: 400 });
  }

  const popularTransfer = await prisma.popularTransfer.create({
    data: {
      zoneId: Number(zoneId),
      vehicleId: Number(vehicleId),
      travelTime,
      sortOrder: sortOrder || 0,
      active: active !== undefined ? active : true,
    },
    include: { zone: true, vehicle: true },
  });
  return NextResponse.json(popularTransfer);
}

// PUT: Actualizar un viaje popular
export async function PUT(req: Request) {
  const body = await req.json();
  const { id, zoneId, vehicleId, travelTime, sortOrder, active } = body;
  const popularTransfer = await prisma.popularTransfer.update({
    where: { id: Number(id) },
    data: {
      zoneId: Number(zoneId),
      vehicleId: Number(vehicleId),
      travelTime,
      sortOrder: sortOrder || 0,
      active,
    },
    include: { zone: true, vehicle: true },
  });
  return NextResponse.json(popularTransfer);
}

// DELETE: Eliminar un viaje popular
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
  await prisma.popularTransfer.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}