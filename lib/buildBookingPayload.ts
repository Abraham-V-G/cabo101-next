import type { BookingPayload } from "@/types/booking";
//buildBookingPayload.ts
type BuildBookingPayloadParams = {
  transaction_amount: number;

  name: string;
  email: string;
  phone: string;

  summary: string;

  pickupLocation: string;
  dropoffLocation: string;

  passengers: string;

  vehicleType: string;

  pickupDate: string;
  pickupTime: string;

  roundTrip: boolean;

  returnPickupLocation?: string;
  returnDropoffLocation?: string;

  returnPickupDate?: string;
  returnPickupTime?: string;

  airline?: string;
  flight?: string;
  arrival?: string;

  additionalService?: number;

  paidAmount?: number;
};

export function buildBookingPayload(
  params: BuildBookingPayloadParams
): BookingPayload {
  return {
    transaction_amount: params.transaction_amount,

    name: params.name,
    email: params.email,
    phone: params.phone,

    summary: params.summary,

    pickupLocation: params.pickupLocation,
    dropoffLocation: params.dropoffLocation,

    passengers: params.passengers,

    vehicleType: params.vehicleType,

    pickupDate: params.pickupDate,
    pickupTime: params.pickupTime,

    roundTrip: params.roundTrip,

    returnPickupLocation:
      params.returnPickupLocation || "",

    returnDropoffLocation:
      params.returnDropoffLocation || "",

    returnPickupDate:
      params.returnPickupDate || "",

    returnPickupTime:
      params.returnPickupTime || "",

    airline: params.airline || "",
    flight: params.flight || "",
    arrival: params.arrival || "",

    additionalService:
      params.additionalService || 0,

    paidAmount:
      params.paidAmount || params.transaction_amount,
  };
}