// components/BookingSummary.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Vehicle = {
  name: string;
  image: string;
  capacity: string | number;
};

type Props = {
  from: string;
  to: string;
  vehicle: Vehicle;
  priceUSD: number | null;
  isLoadingPrice?: boolean;
  passengers: string | number;
  departureDate: string;
  returnDate?: string;
  tripType: "oneway" | "round";
  fromZone?: string;
  toZone?: string;
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month:   "short",
    day:     "numeric",
    year:    "numeric",
  });
};

export default function BookingSummary({
  from,
  to,
  vehicle,
  priceUSD,
  isLoadingPrice = false,
  passengers,
  departureDate,
  returnDate,
  tripType,
}: Props) {
  const displayPrice = isLoadingPrice ? "Calculating..." : `$${priceUSD ?? 0} USD`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl sticky top-6 border border-[#e5e7eb] overflow-hidden"
    >
      {/* Vehicle image header */}
      <div className="bg-[#f3fdf8] px-6 pt-6 pb-4 flex flex-col items-center text-center border-b border-[#e5e7eb]">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          width={200}
          height={110}
          className="object-contain"
        />
        <h3 className="mt-3 font-semibold text-base text-gray-900">
          {vehicle.name}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Up to {vehicle.capacity} passengers
        </p>
      </div>

      <div className="p-6 space-y-5">
        {/* Trip type badge */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Trip Summary</h2>
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{
              background: tripType === "round" ? "#d4f5e7" : "#f3f4f6",
              color:      tripType === "round" ? "#0f6e56" : "#6b7280",
            }}
          >
            {tripType === "round" ? "Round trip" : "One way"}
          </span>
        </div>

        {/* Route */}
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#4ccb8c" }} />
            <p className="text-sm text-gray-700 leading-snug">{from}</p>
          </div>
          {tripType === "round" && (
            <div
              className="ml-[3px] w-px h-4"
              style={{ background: "#e5e7eb", marginLeft: "calc(0.75rem - 0.5px)" }}
            />
          )}
          <div className="flex items-start gap-3">
            <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0 bg-red-400" />
            <p className="text-sm text-gray-700 leading-snug">{to}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#f3f4f6]" />

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#f9fafb] rounded-xl p-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Departure</p>
            <p className="text-xs font-medium text-gray-800">{formatDate(departureDate)}</p>
          </div>

          {tripType === "round" && returnDate ? (
            <div className="bg-[#f9fafb] rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Return</p>
              <p className="text-xs font-medium text-gray-800">{formatDate(returnDate)}</p>
            </div>
          ) : (
            <div className="bg-[#f9fafb] rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Passengers</p>
              <p className="text-xs font-medium text-gray-800">
                {passengers} {Number(passengers) === 1 ? "passenger" : "passengers"}
              </p>
            </div>
          )}

          {tripType === "round" && (
            <div className="bg-[#f9fafb] rounded-xl p-3 col-span-2">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Passengers</p>
              <p className="text-xs font-medium text-gray-800">
                {passengers} {Number(passengers) === 1 ? "passenger" : "passengers"}
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-[#f3f4f6]" />

        {/* Price - ahora usa priceUSD dinámico */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Transport</span>
            <span className="font-medium text-gray-800">{displayPrice}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Taxes</span>
            <span className="font-medium" style={{ color: "#4ccb8c" }}>Included</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-[#f3f4f6]">
            <span className="text-sm font-semibold text-gray-900">Total</span>
            <span className="text-base font-semibold text-gray-900">{displayPrice}</span>
          </div>
        </div>

        {/* Trust badge */}
        <p className="text-[11px] text-gray-400 text-center pt-1">
          Free cancellation · No hidden fees · Flight tracking included
        </p>
      </div>
    </motion.div>
  );
}