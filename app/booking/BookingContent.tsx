"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import VehicleSelector from "@/components/VehicleSelector";
import CheckoutForm from "@/components/CheckoutForm";
import BookingSummary from "@/components/BookingSummary";

const vehicles = [
  { name: "Sedan", capacity: "1-3", price: 197, image: "/cars/sedan.png" },
  { name: "SUV", capacity: "1-5", price: 250, image: "/cars/suv.png" },
  { name: "Van", capacity: "5-7", price: 243, image: "/cars/van.png" },
];

export default function BookingContent() {
  const params = useSearchParams();

  const from = params.get("from");
  const to = params.get("to");

  const [vehicle, setVehicle] = useState(vehicles[0]);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl mb-4">Your Trip</h1>
        <p>{from} → {to}</p>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
        
        {/* VEHICLES */}
        <div className="lg:col-span-1">
          <VehicleSelector
            vehicles={vehicles}
            selected={vehicle}
            onSelect={setVehicle}
          />
        </div>

        {/* FORM */}
        <div className="lg:col-span-1">
          <CheckoutForm vehicle={vehicle} from={from} to={to} />
        </div>

        {/* SUMMARY */}
        <div className="lg:col-span-1">
          <BookingSummary from={from} to={to} vehicle={vehicle} />
        </div>

      </div>
    </div>
  );
}