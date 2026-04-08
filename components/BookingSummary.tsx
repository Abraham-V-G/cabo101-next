"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function BookingSummary({ from, to, vehicle }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6 shadow-sm space-y-6"
    >
      {/* TITLE */}
      <h2 className="text-xl font-semibold">Trip Summary</h2>

      {/* ROUTE */}
      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-2">
          <span className="text-green-500 mt-1">●</span>
          <p className="text-gray-700">{from}</p>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-red-500 mt-1">●</span>
          <p className="text-gray-700">{to}</p>
        </div>
      </div>

      {/* VEHICLE CARD */}
      <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center text-center">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          width={180}
          height={100}
          className="object-contain"
        />

        <h3 className="mt-3 font-semibold text-lg">
          {vehicle.name}
        </h3>

        <p className="text-sm text-gray-500">
          Up to {vehicle.capacity} passengers
        </p>
      </div>

      {/* PRICE */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Transport</span>
          <span className="font-medium">${vehicle.price}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Taxes</span>
          <span className="text-green-600">Included</span>
        </div>
      </div>

      <hr />

      {/* TOTAL */}
      <div className="flex justify-between text-lg font-semibold">
        <span>Total</span>
        <span>${vehicle.price} MXN</span>
      </div>

      {/* TRUST BADGE */}
      <div className="text-xs text-gray-400 text-center">
        Free cancellation • No hidden fees
      </div>
    </motion.div>
  );
}