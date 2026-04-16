"use client";

import { useState, useCallback } from "react";
import PaymentBrick from "@/components/PaymentBrick";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutForm({ vehicle, from, to }: any) {

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    airline: "",
    flight: "",
    arrival: "",
  });

  const [showPayment, setShowPayment] = useState(false);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = useCallback(async (data: any) => {

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
        summary: `${from} → ${to}`,
        extra: formData,
      }),
    });

    return await res.json();

  }, [formData, vehicle.price, from, to]);

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

              {/* ARRIVAL */}
              <div className="input-group col-span-2">
                <input
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
              <span>${vehicle.price} USD</span>
            </div>

            {/* BUTTON */}
            <button
              onClick={() => {
                if (!formData.firstName || !formData.email) {
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