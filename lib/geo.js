export const BCS_BOUNDS = {
  sw: { lat: 22.0, lng: -111.5 },
  ne: { lat: 24.5, lng: -109.0 },
};

export function isPointInBCS(lat, lng) {
  return (
    lat >= BCS_BOUNDS.sw.lat &&
    lat <= BCS_BOUNDS.ne.lat &&
    lng >= BCS_BOUNDS.sw.lng &&
    lng <= BCS_BOUNDS.ne.lng
  );
}
