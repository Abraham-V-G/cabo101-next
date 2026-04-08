"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import VehicleSelector from "@/components/VehicleSelector";
import CheckoutForm from "@/components/CheckoutForm";
import BookingSummary from "@/components/BookingSummary";
import Link from "next/link";
import Image from "next/image";

const vehicles = [
  {
    name: "Sedan",
    capacity: "1-3",
    price: 197,
    image: "/cars/sedan.png",
  },
  {
    name: "SUV",
    capacity: "4-6",
    price: 230,
    image: "/cars/suv.png",
  },
  {
    name: "Van",
    capacity: "7-10",
    price: 260,
    image: "/cars/van.png",
  },
];

export default function Page() {
  const params = useSearchParams();

  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const [vehicle, setVehicle] = useState(vehicles[0]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto">

        <Link href="/" className="flex items-center gap-2 mb-6">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          <span className="font-semibold text-lg">CABO 101</span>
        </Link>

        <h1 className="text-3xl font-semibold mb-2">Your Trip</h1>
        <p className="text-gray-600 mb-8">
          {from} → {to}
        </p>

      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          <VehicleSelector
            vehicles={vehicles}
            selected={vehicle}
            onSelect={setVehicle}
          />

          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <CheckoutForm vehicle={vehicle} />
          </div>

        </div>

        {/* RIGHT */}
        <BookingSummary
          from={from}
          to={to}
          vehicle={vehicle}
        />

      </div>

    </div>
  );
}
