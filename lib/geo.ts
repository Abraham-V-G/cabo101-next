import { prisma } from './prisma'

export async function getZoneFromCoordinates(lat: number, lng: number) {
  const zone = await prisma.zone.findFirst({
    where: {
      latMin: { lte: lat },
      latMax: { gte: lat },
      lngMin: { lte: lng },
      lngMax: { gte: lng },
    }
  })
  return zone
}

export function isPointInBCS(lat: number, lng: number) {
  const BCS_BOUNDS = { sw: { lat: 22.5, lng: -111.5 }, ne: { lat: 25.0, lng: -109.0 } }
  return (
    lat >= BCS_BOUNDS.sw.lat && lat <= BCS_BOUNDS.ne.lat &&
    lng >= BCS_BOUNDS.sw.lng && lng <= BCS_BOUNDS.ne.lng
  )
}
