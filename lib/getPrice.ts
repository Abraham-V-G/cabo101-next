// lib/getPrice.ts

import { pricingMatrix } from "./pricingMatrix";

export type VehicleType = "SUV" | "VAN" | "SPRINTER";

type VehiclePrices = {
  SUV: number;
  VAN: number;
  SPRINTER: number;
};

type PricingMatrix = {
  [zone: string]: {
    [destinationZone: string]: VehiclePrices;
  };
};

export function getPrice(
  fromZone: string,
  toZone: string,
  vehicle: VehicleType
): number | null {
  if (fromZone === toZone) {
    return null;
  }

  const direct = (pricingMatrix as PricingMatrix)?.[fromZone]?.[toZone];

  if (direct && vehicle in direct) {
    return direct[vehicle];
  }

  const reverse = (pricingMatrix as PricingMatrix)?.[toZone]?.[fromZone];

  if (reverse && vehicle in reverse) {
    return reverse[vehicle];
  }

  return null;
}