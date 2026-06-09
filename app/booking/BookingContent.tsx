// app/booking/bookingContent.tsx
// app/booking/bookingContent.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import VehicleSelector from "@/components/VehicleSelector";
import CheckoutForm from "@/components/CheckoutForm";
import BookingSummary from "@/components/BookingSummary";

type Vehicle = {
  name: string;
  capacity: string;
  image: string;
};

const vehicles = [
  {
    name: "SUV",
    capacity: "Up to 6",
    image: "/images/suv.png",
    maxPassengers: 6,
  },
  {
    name: "VAN",
    capacity: "Up to 11",
    image: "/images/van.png",
    maxPassengers: 11,
  },
  {
    name: "SPRINTER",
    capacity: "Up to 19",
    image: "/images/splinter.png",
    maxPassengers: 19,
  },
];

export default function BookingContent() {
  const params = useSearchParams();

  // Parámetros generales
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const departureDate = params.get("departureDate") || "";
  const returnDate = params.get("returnDate") || "";
  const passengers = params.get("passengers") || "1";
  const passengerCount = Number(passengers);
  const tripType = params.get("tripType") || "oneway";

  // Coordenadas (raw strings)
  const fromLatRaw = params.get("fromLat") || "";
  const fromLngRaw = params.get("fromLng") || "";
  const toLatRaw   = params.get("toLat") || "";
  const toLngRaw   = params.get("toLng") || "";

  // Validación robusta (evita que Number("") → 0)
  const hasCoordinates =
    fromLatRaw && fromLngRaw && toLatRaw && toLngRaw;

  const fromLat = Number(fromLatRaw);
  const fromLng = Number(fromLngRaw);
  const toLat   = Number(toLatRaw);
  const toLng   = Number(toLngRaw);

  const isValidCoordinates =
    hasCoordinates &&
    !Number.isNaN(fromLat) &&
    !Number.isNaN(fromLng) &&
    !Number.isNaN(toLat) &&
    !Number.isNaN(toLng);

  // Estados
  const [vehicle, setVehicle] = useState(vehicles[0]);
  const [priceUSD, setPriceUSD] = useState<number | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [fromZone, setFromZone] = useState("");
  const [toZone, setToZone] = useState("");

    useEffect(() => {
    if (vehicle.maxPassengers >= passengerCount) return;

    if (passengerCount > 11) {
        setVehicle(vehicles.find(v => v.name === "SPRINTER")!);
    } else if (passengerCount > 6) {
        setVehicle(vehicles.find(v => v.name === "VAN")!);
    } else {
        setVehicle(vehicles.find(v => v.name === "SUV")!);
    }
    }, [passengerCount, vehicle]);

  // Llamada a /api/pricing
  useEffect(() => {
    let mounted = true;

    // Limpiar estados si no hay coordenadas válidas
    if (!isValidCoordinates) {
      if (mounted) {
        setPriceUSD(null);
        setFromZone("");
        setToZone("");
      }
      return;
    }

    async function calculatePrice() {
      setLoadingPrice(true);
      try {
        const res = await fetch("/api/pricing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fromLat,
            fromLng,
            toLat,
            toLng,
            vehicle: vehicle.name,
            tripType,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Error fetching price");
        }

        if (!mounted) return;

        if (typeof data.priceUSD === "number") {
          setPriceUSD(data.priceUSD);
        } else {
          setPriceUSD(null);
        }

        if (data.fromZone) setFromZone(data.fromZone);
        if (data.toZone) setToZone(data.toZone);
      } catch (error) {
        console.error("Error al obtener precio:", error);
        if (!mounted) return;
        setPriceUSD(null);
        setFromZone("");
        setToZone("");
      } finally {
        if (mounted) setLoadingPrice(false);
      }
    }

    calculatePrice();

    return () => {
      mounted = false;
    };
    }, [
        fromLat,
        fromLng,
        toLat,
        toLng,
        vehicle.name,
        tripType,
        isValidCoordinates,
    ]);

    const availableVehicles = vehicles.map((v) => ({
    ...v,
    disabled: passengerCount > v.maxPassengers,
    }));

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-black">
      {/* HEADER */}
      <div className="bg-white border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <Image src="/images/logo-color.png" alt="Cabo101" width={40} height={40} />
          </Link>
          <div className="text-sm text-gray-500">Step 2 of 2</div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto mb-10">
          <h1 className="text-3xl font-semibold">Details & payment</h1>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">
          {/* COLUMNA IZQUIERDA */}
          <div className="space-y-6">
            <VehicleSelector
            vehicles={availableVehicles}
            selected={vehicle}
            onSelect={setVehicle}
            />

            <CheckoutForm
              vehicle={vehicle}
              priceUSD={priceUSD}
              from={from}
              to={to}
              passengers={passengers}
              departureDate={departureDate}
              returnDate={returnDate}
              tripType={tripType as "oneway" | "round"}
            />
          </div>

          {/* COLUMNA DERECHA */}
          <div className="lg:sticky top-10 h-fit">
            <BookingSummary
              from={from}
              to={to}
              vehicle={vehicle}
              priceUSD={priceUSD}
              passengers={passengers}
              departureDate={departureDate}
              returnDate={returnDate}
              tripType={tripType as "oneway" | "round"}
              fromZone={fromZone}
              toZone={toZone}
              isLoadingPrice={loadingPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
}