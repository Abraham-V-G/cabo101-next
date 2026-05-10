//components/CheckoutForm.tsx

"use client";

import { useState, useCallback } from "react";
import PaymentBrick from "@/components/PaymentBrick";
import { motion, AnimatePresence } from "framer-motion";

type Vehicle = {
  name: string;
  capacity: string;
  price: number;
  image: string;
};

type Props = {
  vehicle: Vehicle;
  from: string;
  to: string;
  passengers: string;
  departureDate: string;
  returnDate: string;
  tripType: string;
};

export default function CheckoutForm({
  vehicle,
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePayment = useCallback(
  async (data: Record<string, any>) => {

    const res = await fetch("/api/process-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      ...data,

      transaction_amount: vehicle.price,

      name: `${formData.firstName} ${formData.lastName}`,

      email: formData.email,

      phone: formData.phone,

      summary:
      tripType === "round"
        ? `${from} ↔ ${to}`
        : `${from} → ${to}`,
      pickupLocation: from,
      dropoffLocation: to,

      passengers,

      vehicleType: vehicle.name,

      pickupDate: departureDate,

      pickupTime: formData.pickupTime,

      roundTrip: tripType === "round",

      returnPickupLocation:
        tripType === "round" ? to : "",

      returnDropoffLocation:
        tripType === "round" ? from : "",

      returnPickupDate:
        tripType === "round"
          ? returnDate
          : "",

      returnPickupTime:
        tripType === "round"
          ? formData.pickupTime
          : "",
      airline: formData.airline,
      flight: formData.flight,
      arrival: formData.arrival,
    }),
    });

    return await res.json();

  }, [
    formData,
    vehicle.price,
    vehicle.name,
    from,
    to,
    passengers,
    departureDate,
    returnDate,
    tripType,
  ]);

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

            <h2 className="text-xl font-semibold">
              Customer Information
            </h2>

            {/* GRID */}
            <div className="grid grid-cols-2 gap-6">

              {/* FIRST NAME */}
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

              {/* LAST NAME */}
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

              {/* EMAIL */}
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

              {/* PHONE */}
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

              {/* AIRLINE */}
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

              {/* FLIGHT */}
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
                <label className="label-line">
                  Pickup Time
                </label>
              </div>

              {/* ARRIVAL */}
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

            

            {/* TOTAL */}
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${vehicle.price} MXN</span>
            </div>

            {/* BUTTON */}
            <button
              type="button"
              onClick={() => {
                if (
                  !formData.firstName ||
                  !formData.email ||
                  !formData.phone
                ) {
                  alert("Complete required fields");
                  return;
                }

                setShowPayment(true);

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="btn-primary"
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
              amount={vehicle.price}
              onSubmit={handlePayment}
            />

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}