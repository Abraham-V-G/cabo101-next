import { prisma } from './prisma'

export async function getPriceFromDB(
  fromZoneSlug: string,
  toZoneSlug: string,
  vehicleName: string,
  tripType: 'oneway' | 'round'
): Promise<number | null> {
  if (fromZoneSlug === toZoneSlug) return null

  const vehicle = await prisma.vehicle.findUnique({ where: { name: vehicleName } })
  if (!vehicle) return null

  const price = await prisma.price.findFirst({
    where: {
      vehicleId: vehicle.id,
      OR: [
        { fromZone: fromZoneSlug, toZone: toZoneSlug },
        { fromZone: toZoneSlug, toZone: fromZoneSlug }
      ]
    }
  })
  if (!price) return null

  return tripType === 'round' ? price.roundTrip : price.oneWay
}