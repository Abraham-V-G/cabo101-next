// app/api/pricing/route.ts
import { NextResponse } from "next/server";
import { getPrice, VehicleType } from "@/lib/getPrice";
import { getZoneFromCoordinates } from "@/lib/zones"; // tu función existente

export async function POST(req: Request) {
  try {
    
    console.log("PRICING API HIT");
    const { fromLat, fromLng, toLat, toLng, vehicle } = await req.json();

    // Validar coordenadas
    if (!fromLat || !fromLng || !toLat || !toLng) {
      return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
    }

    // Obtener zonas
    const fromZone = getZoneFromCoordinates(fromLat, fromLng);
    const toZone = getZoneFromCoordinates(toLat, toLng);

    if (!fromZone || !toZone) {
      return NextResponse.json({ error: "Zone not found" }, { status: 400 });
    }

    // 🔥 Cast a VehicleType para que TypeScript no proteste
    const vehicleType = vehicle as VehicleType;

    const price = getPrice(fromZone.id, toZone.id, vehicleType);

    if (price === null) {
      return NextResponse.json({ error: "Price not available for this route" }, { status: 404 });
    }

    return NextResponse.json({
      fromZone: fromZone.id,
      toZone: toZone.id,
      priceUSD: price,
      vehicle: vehicleType,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}