"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();

  const name = params.get("name");
  const email = params.get("email");
  const vehicle = params.get("vehicle");
  const from = params.get("from");
  const to = params.get("to");
  const price = params.get("price");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-5"
      >
        <div className="text-5xl">✅</div>

        <h1 className="text-2xl font-bold text-green-600">
          Booking Confirmed!
        </h1>

        <p className="text-gray-600">
          A confirmation email has been sent to you.
        </p>

        <div className="bg-gray-100 p-4 rounded-xl text-left text-sm space-y-1">
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>From:</strong> {from}</p>
          <p><strong>To:</strong> {to}</p>
          <p><strong>Vehicle:</strong> {vehicle}</p>
          <p><strong>Total:</strong> ${price} MXN</p>
        </div>

        <button
          onClick={() => router.push("/")}
          className="bg-black text-white px-6 py-3 rounded-xl hover:scale-105 transition"
        >
          Back to Home
        </button>
      </motion.div>
    </div>
  );
}