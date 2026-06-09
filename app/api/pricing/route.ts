// app/api/pricing/route.ts
import { NextResponse } from "next/server";
import { getPrice, VehicleType } from "@/lib/getPrice";
import { getZoneFromCoordinates } from "@/lib/zones";

export async function POST(req: Request) {
  try {

    console.log("PRICING API HIT");

    const {
      fromLat,
      fromLng,
      toLat,
      toLng,
      vehicle,
      tripType,
    } = await req.json();

    // validar coordenadas
    if (
      fromLat == null ||
      fromLng == null ||
      toLat == null ||
      toLng == null
    ) {
      return NextResponse.json(
        { error: "Missing coordinates" },
        { status: 400 }
      );
    }

    // obtener zonas
    const fromZone = getZoneFromCoordinates(
      Number(fromLat),
      Number(fromLng)
    );

    const toZone = getZoneFromCoordinates(
      Number(toLat),
      Number(toLng)
    );

    if (!fromZone) {
      return NextResponse.json(
        { error: "Origin zone not found" },
        { status: 400 }
      );
    }

    if (!toZone) {
      return NextResponse.json(
        { error: "Destination zone not found" },
        { status: 400 }
      );
    }

    const vehicleType = vehicle as VehicleType;
    console.log("FROM:", fromZone);
    console.log("TO:", toZone);
    console.log("TRIP TYPE:", tripType);
    console.log("VEHICLE:", vehicleType);
    const price = getPrice(
        fromZone.id,
        toZone.id,
        vehicleType,
        tripType === "round" ? "round" : "oneway"
    );

    console.log("PRICE:", price);

    if (price === null) {
      return NextResponse.json(
        {
          error: "Price not available for this route",
          fromZone: fromZone.id,
          toZone: toZone.id,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      fromZone: fromZone.id,
      toZone: toZone.id,
      vehicle: vehicleType,
      tripType,
      priceUSD: price,
    });

  } catch (error) {
    console.error("PRICING ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}