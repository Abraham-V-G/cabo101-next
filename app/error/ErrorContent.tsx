//app/error/ErrorContent.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ErrorPage() {
  const params = useSearchParams();
  const router = useRouter();
  const type = params.get("type");
  const detail = params.get("detail");

  let title = "Payment Error";
  let message = "There was an error processing your payment. Please try again.";

  if (type === "rejected") {
    title = "Payment Rejected";
    if (detail === "cc_rejected_high_risk") {
      message = "Your payment was rejected due to security reasons. Please use a different card or payment method.";
    } else {
      message = `Your payment was rejected (${detail}). Please contact your bank or try another card.`;
    }
  } else if (type === "failed") {
    title = "Payment Failed";
    message = "The payment could not be completed. Please try again.";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-5"
      >
        <div className="text-5xl">❌</div>
        <h1 className="text-2xl font-bold text-red-600">{title}</h1>
        <p className="text-gray-600">{message}</p>
        <button
          onClick={() => router.back()}
          className="bg-black text-white px-6 py-3 rounded-xl hover:scale-105 transition"
        >
          Go Back
        </button>
      </motion.div>
    </div>
  );
}