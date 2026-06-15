import { prisma } from './prisma'

export type VehicleName = 'SUV' | 'VAN' | 'SPRINTER' // puedes ampliarlo después

export async function getPriceFromDB(
  fromZone: string,
  toZone: string,
  vehicleName: VehicleName,
  tripType: 'oneway' | 'round'
): Promise<number | null> {
  if (fromZone === toZone) return null

  // Buscar el vehículo por nombre
  const vehicle = await prisma.vehicle.findUnique({
    where: { name: vehicleName }
  })
  if (!vehicle) return null

  // Buscar el precio en cualquiera de las dos direcciones
  const price = await prisma.price.findFirst({
    where: {
      vehicleId: vehicle.id,
      OR: [
        { fromZone, toZone },
        { fromZone: toZone, toZone: fromZone }
      ]
    }
  })

  if (!price) return null

  return tripType === 'round' ? price.roundTrip : price.oneWay
}