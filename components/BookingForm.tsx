"use client";

import { useEffect, useRef, useState } from "react";
import MapModal from "./MapModal";
import Image from "next/image";

declare global {
  interface Window {
    google: any;
  }
}

export default function BookingForm() {
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);

  const [showMap, setShowMap] = useState(false);
  const [activeInput, setActiveInput] = useState<"from" | "to" | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!(window as any).google) return;

    const options = {
      componentRestrictions: { country: "mx" },
      bounds: new window.google.maps.LatLngBounds(
        { lat: 22.5, lng: -110.5 },
        { lat: 25.5, lng: -108.5 }
      ),
      strictBounds: true,
      fields: ["geometry", "formatted_address"],
    };

    const fromAuto = new window.google.maps.places.Autocomplete(
      fromRef.current!,
      options
    );

    const toAuto = new window.google.maps.places.Autocomplete(
      toRef.current!,
      options
    );

    const handlePlace = (autocomplete: any, ref: any) => {
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        ref.current.value = place.formatted_address;
      });
    };

    handlePlace(fromAuto, fromRef);
    handlePlace(toAuto, toRef);
  }, []);

  const handleMapSelect = (data: any) => {
    if (activeInput === "from") {
      fromRef.current!.value = data.address;
    } else {
      toRef.current!.value = data.address;
    }

    setShowMap(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const from = fromRef.current?.value;
    const to = toRef.current?.value;

    const date = e.target.querySelector('input[type="date"]').value;
    const passengers = e.target.querySelector("select").value;

    if (!from || !to) {
      alert("Please select locations");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to, date, passengers }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      const params = new URLSearchParams({
        from,
        to,
        date,
        passengers,
      });

      window.location.href = `/booking?${params.toString()}`;
    } catch (err) {
      console.error(err);
      alert("Error searching");
    }

    setLoading(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl w-full h-[65px] flex items-center overflow-hidden text-gray-700 shadow-lg"
      >
        {/* FROM */}
        <div className="flex-[2] flex items-center gap-2 px-3">
          <Image src="/images/from.png" alt="from" width={12} height={12} />
          <input
            ref={fromRef}
            type="text"
            placeholder="From airport, hotel, airbnb"
            className="w-full h-full outline-none"
          />
        </div>

        {/* TO */}
        <div className="flex-[2] flex items-center gap-2 px-3">
          <Image src="/images/to.png" alt="to" width={18} height={18} />
          <input
            ref={toRef}
            type="text"
            placeholder="To airport, hotel, airbnb"
            className="w-full h-full outline-none"
          />
        </div>

        {/* DATE */}
        <div className="flex items-center gap-2 px-3 flex-1 border-r border-gray-200">
          <Image src="/images/calendar.png" alt="" width={18} height={18} />
          <input type="date" className="w-full h-full outline-none" />
        </div>

        {/* PASSENGERS */}
        <div className="flex items-center gap-2 px-3 flex-1 border-r border-gray-200">
          <Image src="/images/user.png" alt="" width={18} height={18} />
          <select className="w-full h-full outline-none">
            {[...Array(19)].map((_, i) => (
              <option key={i}>
                {i + 1} Passenger{i > 0 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="bg-white text-black px-8 h-full font-semibold"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <MapModal
        isOpen={showMap}
        onClose={() => setShowMap(false)}
        onSelect={handleMapSelect}
      />
    </>
  );
}