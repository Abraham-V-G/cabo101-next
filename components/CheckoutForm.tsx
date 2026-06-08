//components/CheckoutForm.tsx

"use client";

import { useState, useCallback } from "react";
import PaymentBrick from "@/components/PaymentBrick";
import { motion, AnimatePresence } from "framer-motion";
import { buildBookingPayload } from "@/lib/buildBookingPayload";

type Vehicle = {
  name: string;
  capacity: string;
  image: string;
};

type Props = {
  vehicle: Vehicle;
  priceUSD: number | null;
  from: string;
  to: string;
  passengers: string;
  departureDate: string;
  returnDate: string;
  tripType: string;
};

export default function CheckoutForm({
  vehicle,
  priceUSD,
  from,
  to,
  passengers,
  departureDate,
  returnDate,
  tripType,
}: Props) {  

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    airline: "",
    flight: "",
    arrival: "",
    pickupTime: "",
  });

  const [showPayment, setShowPayment] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePayment = useCallback(
    async (brickData: Record<string, any>) => {
      // 🔥 DEBUG: ver qué envía realmente el PaymentBrick
      console.log("BRICK DATA:", brickData);
      console.log("BRICK DATA", brickData);
      if (priceUSD === null) {
        throw new Error("Price not available. Please refresh the page.");
      }

      // Determinar la estructura de brickData (puede ser directa o anidada en formData)
      const token = brickData.token ?? brickData.formData?.token;
      const payment_method_id = brickData.payment_method_id ?? brickData.formData?.payment_method_id;
      const issuer_id = brickData.issuer_id ?? brickData.formData?.issuer_id;
      const installments = brickData.installments ?? brickData.formData?.installments;

      if (!token || !payment_method_id) {
        throw new Error("Missing payment information from the brick");
      }

      // Datos de reserva (sin campos del brick)
      const bookingPayload = buildBookingPayload({
        transaction_amount: priceUSD, // USD, se convertirá en backend
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        summary: tripType === "round" ? `${from} ↔ ${to}` : `${from} → ${to}`,
        pickupLocation: from,
        dropoffLocation: to,
        passengers,
        vehicleType: vehicle.name,
        pickupDate: departureDate,
        pickupTime: formData.pickupTime,
        roundTrip: tripType === "round",
        returnPickupLocation: tripType === "round" ? to : "",
        returnDropoffLocation: tripType === "round" ? from : "",
        returnPickupDate: tripType === "round" ? returnDate : "",
        returnPickupTime: tripType === "round" ? formData.pickupTime : "",
        airline: formData.airline,
        flight: formData.flight,
        arrival: formData.arrival,
      });

      // Fusionar campos de pago
      const payload = {
        ...bookingPayload,
        token,
        payment_method_id,
        issuer_id,
        installments: installments || 1,
        payer: brickData.formData?.payer,
      };

      const res = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      console.log("PROCESS PAYMENT RESPONSE:", result);

      if (!res.ok) {
        throw new Error(result.error || "Payment failed");
      }

      if (result.status === "approved") {
        window.location.href = `/booking/success?id=${result.id}`;
      }

      return result;
    },
    [
      formData,
      priceUSD,
      vehicle.name,
      from,
      to,
      passengers,
      departureDate,
      returnDate,
      tripType,
    ]
  );

  const totalDisplay = priceUSD === null
    ? "Calculating..."
    : `$${priceUSD} USD`;

  const isContinueDisabled = priceUSD === null ||
    !formData.firstName ||
    !formData.email ||
    !formData.phone;

  return (
    <div className="bg-white text-black p-6 rounded-3xl shadow space-y-6">
      <AnimatePresence mode="wait">
        {!showPayment ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold">Customer Information</h2>

            <div className="grid grid-cols-2 gap-6">
              <div className="input-group">
                <input
                  required
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-line peer"
                  placeholder=" "
                />
                <label className="label-line">First Name</label>
              </div>

              <div className="input-group">
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-line peer"
                  placeholder=" "
                />
                <label className="label-line">Last Name</label>
              </div>

              <div className="input-group col-span-2">
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-line peer"
                  placeholder=" "
                />
                <label className="label-line">Email</label>
              </div>

              <div className="input-group col-span-2">
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-line peer"
                  placeholder=" "
                />
                <label className="label-line">Phone</label>
              </div>

              <div className="input-group">
                <input
                  name="airline"
                  value={formData.airline}
                  onChange={handleChange}
                  className="input-line peer"
                  placeholder=" "
                />
                <label className="label-line">Airline</label>
              </div>

              <div className="input-group">
                <input
                  name="flight"
                  value={formData.flight}
                  onChange={handleChange}
                  className="input-line peer"
                  placeholder=" "
                />
                <label className="label-line">Flight Number</label>
              </div>

              <div className="input-group col-span-2">
                <input
                  type="time"
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={handleChange}
                  className="input-line peer"
                  placeholder=" "
                />
                <label className="label-line">Pickup Time</label>
              </div>

              <div className="input-group col-span-2">
                <input
                  type="time"
                  name="arrival"
                  value={formData.arrival}
                  onChange={handleChange}
                  className="input-line peer"
                  placeholder=" "
                />
                <label className="label-line">Arrival Time</label>
              </div>
            </div>

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{totalDisplay}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                if (isContinueDisabled) {
                  alert(priceUSD === null
                    ? "Price is still loading. Please wait."
                    : "Complete required fields");
                  return;
                }
                setShowPayment(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={isContinueDisabled}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Payment
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="payment"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#d4f5e7] rounded-3xl p-4"
          >
            <PaymentBrick
              amount={priceUSD ?? 0}
              onSubmit={handlePayment}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}