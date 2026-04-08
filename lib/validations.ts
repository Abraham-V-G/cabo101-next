import { z } from "zod";

export const bookingSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),

  airline: z.string().optional(),
  flightNumber: z.string().optional(),
  arrivalTime: z.string().optional(),

  vehicle: z.string(),
  paymentMethod: z.string(),

  requests: z.string().optional(),
});