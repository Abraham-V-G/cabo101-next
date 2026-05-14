export type BookingPayload = {
  transaction_amount: number;

  name: string;
  email: string;
  phone?: string;

  summary: string;

  pickupLocation?: string;
  dropoffLocation?: string;

  passengers?: string;
  vehicleType?: string;

  pickupDate?: string;
  pickupTime?: string;

  roundTrip?: boolean;

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