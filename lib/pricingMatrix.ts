//lib/pricingMatrix.ts

type VehiclePrices = {
  SUV: number;
  VAN: number;
  SPRINTER: number;
};

type PricingMatrix = Record<
  string,
  Record<string, VehiclePrices>
>;

export const pricingMatrix: PricingMatrix = {
  airport: {
    "cabo-san-lucas": {
      SUV: 5,
      VAN: 150,
      SPRINTER: 200,
    },
  },

  "cabo-san-lucas": {},

  "san-jose-del-cabo": {},
  "puerto-los-cabos": {},
  "tourist-corridor": {},
  "east-cape": {},
  "los-barriles": {},
  sunset: {},
  pacifico: {},
  "todos-santos": {},
  "la-paz": {},
};