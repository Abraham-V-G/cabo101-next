// lib/buildBookingPayload.ts

type BookingInput = {
  transaction_amount: number;
  name: string;
  email: string;
  phone: string;
  summary: string;
  pickupLocation: string;
  dropoffLocation: string;
  passengers: string | number;
  vehicleType: string;
  pickupDate: string;
  pickupTime: string;
  roundTrip: boolean;
  returnPickupLocation: string;
  returnDropoffLocation: string;
  returnPickupDate: string;
  returnPickupTime: string;
  airline?: string;          // opcional
  flight?: string;           // opcional
  arrival?: string;          // opcional
  additionalService?: number; // ✅ nuevo
  paidAmount?: number;        // ✅ nuevo
};

export function buildBookingPayload(input: BookingInput) {
  return {
    // Datos de la reserva (raíz)
    transaction_amount: input.transaction_amount,
    name: input.name,
    email: input.email,
    phone: input.phone,
    pickupLocation: input.pickupLocation,
    dropoffLocation: input.dropoffLocation,
    passengers: input.passengers,
    vehicleType: input.vehicleType,
    pickupDate: input.pickupDate,
    pickupTime: input.pickupTime,
    roundTrip: input.roundTrip,
    returnPickupLocation: input.returnPickupLocation,
    returnDropoffLocation: input.returnDropoffLocation,
    returnPickupDate: input.returnPickupDate,
    returnPickupTime: input.returnPickupTime,
    airline: input.airline,
    flight: input.flight,
    arrival: input.arrival,
    additionalService: input.additionalService, // ✅
    paidAmount: input.paidAmount,               // ✅

    description: input.summary,

    payer: {
      name: input.name,
      email: input.email,
      phone: {
        number: input.phone,
      },
    },

    metadata: {
      booking: {
        pickupLocation: input.pickupLocation,
        dropoffLocation: input.dropoffLocation,
        passengers: input.passengers,
        vehicleType: input.vehicleType,
        pickupDate: input.pickupDate,
        pickupTime: input.pickupTime,
        roundTrip: input.roundTrip,
        returnPickupLocation: input.returnPickupLocation,
        returnDropoffLocation: input.returnDropoffLocation,
        returnPickupDate: input.returnPickupDate,
        returnPickupTime: input.returnPickupTime,
        airline: input.airline,
        flight: input.flight,
        arrival: input.arrival,
        additionalService: input.additionalService,
        paidAmount: input.paidAmount,
      },
    },
  };
}