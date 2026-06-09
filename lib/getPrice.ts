// lib/getPrice.ts

import { pricingMatrix } from "./pricingMatrix";

export type VehicleType =
  | "SUV"
  | "VAN"
  | "SPRINTER";

type PriceType = {
  oneWay: number;
  roundTrip: number;
};

type VehiclePrices = {
  SUV: PriceType;
  VAN: PriceType;
  SPRINTER: PriceType;
};

export function getPrice(
  fromZone: string,
  toZone: string,
  vehicle: VehicleType,
  tripType: "oneway" | "round"
): number | null {

  // misma zona
  if (fromZone === toZone) {
    return null;
  }

  // buscar directa o inversa
  const route =
    pricingMatrix[fromZone]?.[toZone] ||
    pricingMatrix[toZone]?.[fromZone];

  if (!route) {
    return null;
  }

  return tripType === "round"
    ? route[vehicle].roundTrip
    : route[vehicle].oneWay;
}