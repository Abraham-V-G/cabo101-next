//lib/pricingMatrix.ts

type PriceType = {
  oneWay: number;
  roundTrip: number;
};

type VehiclePrices = {
  SUV: PriceType;
  VAN: PriceType;
  SPRINTER: PriceType;
};

type PricingMatrix = Record<
  string,
  Record<string, VehiclePrices>
>;

export const pricingMatrix: PricingMatrix = {
  airport: {
    "san-jose-del-cabo": {
      SUV: { oneWay: 69, roundTrip: 134 },
      VAN: { oneWay: 82, roundTrip: 153 },
      SPRINTER: { oneWay: 109, roundTrip: 192 },
    },

    "puerto-los-cabos": {
      SUV: { oneWay: 82, roundTrip: 152 },
      VAN: { oneWay: 88, roundTrip: 163 },
      SPRINTER: { oneWay: 114, roundTrip: 214 },
    },

    "cabo-san-lucas": {
      SUV: { oneWay: 89, roundTrip: 166 },
      VAN: { oneWay: 94, roundTrip: 172 },
      SPRINTER: { oneWay: 119, roundTrip: 227 },
    },

    sunset: {
      SUV: { oneWay: 93, roundTrip: 180 },
      VAN: { oneWay: 100, roundTrip: 190 },
      SPRINTER: { oneWay: 155, roundTrip: 283 },
    },

    pacifico: {
      SUV: { oneWay: 99, roundTrip: 190 },
      VAN: { oneWay: 109, roundTrip: 198 },
      SPRINTER: { oneWay: 140, roundTrip: 262 },
    },

    "east-cape": {
      SUV: { oneWay: 95, roundTrip: 186 },
      VAN: { oneWay: 130, roundTrip: 199 },
      SPRINTER: { oneWay: 149, roundTrip: 259 },
    },

    "tourist-corridor": {
      SUV: { oneWay: 80, roundTrip: 152 },
      VAN: { oneWay: 85, roundTrip: 158 },
      SPRINTER: { oneWay: 115, roundTrip: 213 },
    },
  },

  "san-jose-del-cabo": {},
  "puerto-los-cabos": {},
  "tourist-corridor": {},
  "east-cape": {},
  "los-barriles": {},
  "cabo-san-lucas": {},
  sunset: {},
  pacifico: {},
  "todos-santos": {},
  "la-paz": {},
};