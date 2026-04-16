"use client";

import { useEffect, useRef, useState } from "react";
import MapModal from "./MapModal";
import Image from "next/image";

declare global {
  interface Window {
    google: any;
  }
}

export default function BookingForm({
  tripType,
}: {
  tripType: "oneway" | "round";
}) {
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);

  const [showMap, setShowMap] = useState(false);
  const [activeInput, setActiveInput] = useState<"from" | "to" | null>(null);
  const [loading, setLoading] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const from = fromRef.current?.value;
    const to = toRef.current?.value;

    const passengers = e.target.querySelector("select").value;

    if (!from || !to) {
      alert("Please select locations");
      return;
    }

    setLoading(true);

    const params = new URLSearchParams({
      from,
      to,
      date: departureDate,
      passengers,
      tripType,
    });

    window.location.href = `/booking?${params.toString()}`;

    setLoading(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl w-full h-[65px] flex items-center overflow-hidden text-gray-700 shadow-lg"
        style={{ fontFamily: "Manrope, sans-serif", fontWeight: 200 }}
      >
        {/* FROM */}
        <div className="flex-[2] flex items-center gap-2 px-3">
          <Image src="/images/from.png" alt="" width={12} height={12} />
          <input
            ref={fromRef}
            placeholder="From airport, hotel, airbnb"
            className="w-full h-full outline-none"
            style={{ fontFamily: "Manrope, sans-serif", fontWeight: 200 }}
          />
        </div>

        {/* TO */}
        <div className="flex-[2] flex items-center gap-2 px-3">
          <Image src="/images/to.png" alt="" width={18} height={18} />
          <input
            ref={toRef}
            placeholder="To airport, hotel, airbnb"
            className="w-full h-full outline-none"
            style={{ fontFamily: "Manrope, sans-serif", fontWeight: 200 }}
          />
        </div>

        {/* DATE */}
        <div
          onClick={() => setShowDatePicker(true)}
          className="flex items-center gap-2 px-3 flex-1 border-r border-gray-200 cursor-pointer"
        >
          <Image src="/images/calendar.png" alt="" width={18} height={18} />
          <span className="text-sm" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 200 }}>
            {departureDate
              ? departureDate +
                (tripType === "round" && returnDate
                  ? ` → ${returnDate}`
                  : "")
              : "Select date"}
          </span>
        </div>

        {/* PASSENGERS */}
        <div className="flex items-center gap-2 px-3 flex-1 border-r border-gray-200">
          <Image src="/images/user.png" alt="" width={18} height={18} />
          <select
            className="w-full h-full outline-none"
            style={{ fontFamily: "Manrope, sans-serif", fontWeight: 200 }}
          >
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
          className="bg-[#4ccb8c] text-white px-8 h-full font-semibold"
          style={{ fontFamily: "Manrope, sans-serif", fontWeight: 200 }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* 🔥 CALENDAR MODAL */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl space-y-4">
            <h2 className="text-lg font-semibold" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 200 }}>
              Select your trip
            </h2>

            <p className="text-sm text-gray-500" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 200 }}>
              {tripType === "round" ? "Round trip" : "One way"}
            </p>

            {/* DEPARTURE */}
            <div>
              <label className="text-sm" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 200 }}>
                Departure
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full border rounded-xl p-3 mt-1"
                style={{ fontFamily: "Manrope, sans-serif", fontWeight: 200 }}
              />
            </div>

            {/* RETURN */}
            {tripType === "round" && (
              <div>
                <label className="text-sm" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 200 }}>
                  Return
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full border rounded-xl p-3 mt-1"
                  style={{ fontFamily: "Manrope, sans-serif", fontWeight: 200 }}
                />
              </div>
            )}

            <button
              onClick={() => setShowDatePicker(false)}
              className="w-full bg-[#4ccb8c] text-white py-3 rounded-xl"
              style={{ fontFamily: "Manrope, sans-serif", fontWeight: 200 }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      <MapModal
        isOpen={showMap}
        onClose={() => setShowMap(false)}
        onSelect={() => {}}
      />
    </>
  );
}