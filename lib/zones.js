//lib/zones.js
export const BCS_BOUNDS = {
  sw: { lat: 22.5, lng: -111.5 },
  ne: { lat: 25.0, lng: -109.0 },
};
export const ZONE_IDS = [
  "airport",
  "san-jose-del-cabo",
  "puerto-los-cabos",
  "tourist-corridor",
  "east-cape",
  "los-barriles",
  "cabo-san-lucas",
  "sunset",
  "pacifico",
  "todos-santos",
  "la-paz",
];

export const ZONES = [
  {
    id: "los-barriles",
    name: "Los Barriles",
    latMin: 23.5450,
    latMax: 23.7200,
    lngMin: -109.7050,
    lngMax: -109.6300,
  },

  {
    id: "cabo-san-lucas",
    name: "Cabo San Lucas",
    latMin: 22.86872,
    latMax: 22.9500,
    lngMin: -109.92542,
    lngMax: -109.84086,
  },

  {
    id: "sunset",
    name: "Sunset",
    latMin: 22.86798,
    latMax: 22.9100,
    lngMin: -109.97393,
    lngMax: -109.92542,
  },

  {
    id: "pacifico",
    name: "Pacifico",
    latMin: 22.87237,
    latMax: 22.9600,
    lngMin: -110.04187,
    lngMax: -109.97393,
  },

  {
    id: "tourist-corridor",
    name: "Tourist Corridor",
    latMin: 22.90316,
    latMax: 23.0300,
    lngMin: -109.84086,
    lngMax: -109.7000,
  },

  {
    id: "san-jose-del-cabo",
    name: "San José del Cabo",
    latMin: 23.0300,
    latMax: 23.1400,
    lngMin: -109.7600,
    lngMax: -109.6900,
  },

  {
    id: "puerto-los-cabos",
    name: "Puerto Los Cabos",
    latMin: 23.0300,
    latMax: 23.0800,
    lngMin: -109.6900,
    lngMax: -109.6200,
  },

  {
    id: "east-cape",
    name: "East Cape",
    latMin: 23.0500,
    latMax: 23.1394,
    lngMin: -109.6200,
    lngMax: -109.54491,
  },

  {
    id: "la-paz",
    name: "La Paz",
    latMin: 24.0500,
    latMax: 24.2000,
    lngMin: -110.4200,
    lngMax: -110.2500,
  },

  {
    id: "todos-santos",
    name: "Todos Santos",
    latMin: 23.4000,
    latMax: 23.5000,
    lngMin: -110.3000,
    lngMax: -110.2000,
  },

  {
    id: "airport",
    name: "SJD Airport",
    latMin: 23.1400,
    latMax: 23.1700,
    lngMin: -109.7350,
    lngMax: -109.7050,
    isAirport: true,
  },
];
export function getZoneFromCoordinates(lat, lng) {
  const zone = ZONES.find(
    (z) =>
      lat >= z.latMin &&
      lat <= z.latMax &&
      lng >= z.lngMin &&
      lng <= z.lngMax
  );

  return zone || null;
}
export function isPointInBCS(lat, lng) {
  return (
    lat >= BCS_BOUNDS.sw.lat &&
    lat <= BCS_BOUNDS.ne.lat &&
    lng >= BCS_BOUNDS.sw.lng &&
    lng <= BCS_BOUNDS.ne.lng
  );
}