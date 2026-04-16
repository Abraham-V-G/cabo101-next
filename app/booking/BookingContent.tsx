"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import VehicleSelector from "@/components/VehicleSelector";
import CheckoutForm from "@/components/CheckoutForm";
import BookingSummary from "@/components/BookingSummary";

const vehicles = [
  { name: "SUV", capacity: "1-3", price: 197, image: "/images/suv.png" },
  { name: "Van", capacity: "1-5", price: 250, image: "/images/van.png" },
  { name: "Splinter", capacity: "5-7", price: 243, image: "/images/splinter.png" },
];

export default function BookingContent() {
  const params = useSearchParams();

  const from = params.get("from");
  const to = params.get("to");

  const [vehicle, setVehicle] = useState(vehicles[0]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-black">

      {/* 🔥 HEADER CON LOGO */}
      <div className="bg-white border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO CLICKABLE */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <Image
              src="/images/logo.png"
              alt="Cabo101"
              width={40}
              height={40}
            />
          </Link>

          {/* OPCIONAL: progreso tipo Stripe */}
          <div className="text-sm text-gray-500">
            Step 2 of 2
          </div>

        </div>
      </div>

      {/* CONTENIDO */}
      <div className="p-6">

        {/* TITLE */}
        <div className="max-w-7xl mx-auto mb-10">
          <h1 className="text-3xl font-semibold">
            Details & payment
          </h1>

        </div>

        {/* GRID */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">

          {/* IZQUIERDA */}
          <div className="space-y-6">

            <VehicleSelector
              vehicles={vehicles}
              selected={vehicle}
              onSelect={setVehicle}
            />

            <CheckoutForm vehicle={vehicle} from={from} to={to} />

          </div>

          {/* DERECHA */}
          <div className="lg:sticky top-10 h-fit">
            <BookingSummary from={from} to={to} vehicle={vehicle} />
          </div>

        </div>

      </div>
    </div>
  );
}