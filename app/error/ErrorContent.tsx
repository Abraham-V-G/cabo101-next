"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-5"
      >
        <div className="text-5xl">❌</div>

        <h1 className="text-2xl font-bold text-red-600">
          Payment Failed
        </h1>

        <p className="text-gray-600">
          Something went wrong with your payment. Please try again.
        </p>

        <button
          onClick={() => router.push("/")}
          className="bg-black text-white px-6 py-3 rounded-xl hover:scale-105 transition"
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );
}