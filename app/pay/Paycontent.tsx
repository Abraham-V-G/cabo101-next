// app/pay/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import Image from "next/image";
import PaymentBrick from "@/components/PaymentBrick";
import { motion, AnimatePresence } from "framer-motion";

export default function PayContent() {
  const params = useSearchParams();
  const router = useRouter();

  // Leer todos los parámetros de la URL
  const amount = Number(params.get("amount") || 0);
  const summary = params.get("summary") || "Transportation Service";
  const nameParam = params.get("name") || "";
  const emailParam = params.get("email") || "";
  const phoneParam = params.get("phone") || "";
  const pickupLocation = params.get("pickupLocation") || "";
  const dropoffLocation = params.get("dropoffLocation") || "";
  const passengers = params.get("passengers") || "";
  const vehicleType = params.get("vehicleType") || "";
  const pickupTime = params.get("pickupTime") || "";
  const pickupDate = params.get("pickupDate") || "";
  const roundTrip = params.get("roundTrip") === "true";
  const returnPickupLocation = params.get("returnPickupLocation") || "";
  const returnDropoffLocation = params.get("returnDropoffLocation") || "";
  const returnPickupTime = params.get("returnPickupTime") || "";
  const returnPickupDate = params.get("returnPickupDate") || "";
  const additionalService = Number(params.get("additionalService") || 0);

  const [name, setName] = useState(nameParam);
  const [email, setEmail] = useState(emailParam);
  const [showPayment, setShowPayment] = useState(false);

  const handlePayment = useCallback(
    async (data: any) => {
      const res = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          transaction_amount: amount,
          name,
          email,
          summary,
          phone: phoneParam,
          pickupLocation,
          dropoffLocation,
          passengers,
          vehicleType,
          pickupTime,
          pickupDate,
          roundTrip,
          returnPickupLocation,
          returnDropoffLocation,
          returnPickupTime,
          returnPickupDate,
          additionalService,
          paidAmount: amount,
        }),
      });

      const result = await res.json();

      if (result.status === "approved") {
        router.push(`/success?amount=${amount}`);
      } else if (result.status === "pending" || result.status === "in_process") {
        router.push(`/success?status=pending`);
      } else {
        router.push(`/error?type=failed`);
      }

      return result;
    },
    [
      amount,
      name,
      email,
      summary,
      phoneParam,
      pickupLocation,
      dropoffLocation,
      passengers,
      vehicleType,
      pickupTime,
      pickupDate,
      roundTrip,
      returnPickupLocation,
      returnDropoffLocation,
      returnPickupTime,
      returnPickupDate,
      additionalService,
      router,
    ]
  );

  return (
    <div className="min-h-screen flex justify-center bg-[#f5f5f5] px-4 pt-10">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Image src="/images/logo-color.png" alt="logo" width={80} height={80} />
        </div>
        <h2 className="text-3xl font-semibold text-center text-black">
          Complete Payment
        </h2>
        <div className="border-2 border-[#4ccb8c] rounded-2xl p-4 text-black bg-white text-center">
          {summary}
        </div>

        <AnimatePresence mode="wait">
          {!showPayment ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-[#4ccb8c] rounded-2xl px-4 py-3 bg-white text-black"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-[#4ccb8c] rounded-2xl px-4 py-3 bg-white text-black"
              />
              <div className="flex justify-between items-center text-xl font-semibold text-black px-1">
                <span>Total</span>
                <span>${amount} MXN</span>
              </div>
              <button
                onClick={() => {
                  if (!name || !email) {
                    alert("Please complete name and email");
                    return;
                  }
                  setShowPayment(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full bg-[#2d6cdf] text-white py-4 rounded-2xl font-semibold shadow-md hover:opacity-90 transition"
              >
                Pay
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#d4f5e7] rounded-3xl p-4"
            >
              <PaymentBrick amount={amount} onSubmit={handlePayment} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}