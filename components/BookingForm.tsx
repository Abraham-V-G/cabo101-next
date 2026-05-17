// components/BookingForm.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import useGoogleMaps from "@/lib/useGoogleMaps";

declare global {
  interface Window { google: any; }
}

export default function BookingForm({ tripType }: { tripType: "oneway" | "round" }) {
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);
  const fromPlaceRef = useRef<any>(null);
  const toPlaceRef = useRef<any>(null);

  const [loading, setLoading] = useState(false);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [showDepartureCalendar, setShowDepartureCalendar] = useState(false);
  const [showReturnCalendar, setShowReturnCalendar] = useState(false);

  const mapsLoaded = useGoogleMaps();

  useEffect(() => {
    if (!mapsLoaded || !window.google?.maps?.places) return;

    try {
      const options = {
        componentRestrictions: { country: "mx" },
        bounds: new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(22.5, -110.5),
          new window.google.maps.LatLng(25.5, -108.5)
        ),
        strictBounds: true,
        fields: ["geometry", "formatted_address", "name", "types"],
      };

      if (fromRef.current) {
        const fromAuto = new window.google.maps.places.Autocomplete(fromRef.current, options);
        fromAuto.addListener("place_changed", () => {
          const place = fromAuto.getPlace();
          if (place?.geometry && fromRef.current) {
            fromPlaceRef.current = place;
            fromRef.current.value = place.name;
          }
        });
      }

      if (toRef.current) {
        const toAuto = new window.google.maps.places.Autocomplete(toRef.current, options);
        toAuto.addListener("place_changed", () => {
          const place = toAuto.getPlace();
          if (place?.geometry && toRef.current) {
            toPlaceRef.current = place;
            toRef.current.value = place.name;
          }
        });
      }
    } catch (error) {
      console.error("Error inicializando Google Places:", error);
    }
  }, [mapsLoaded]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fromPlace = fromPlaceRef.current;
    const toPlace = toPlaceRef.current;

    if (!fromPlace || !toPlace) {
      alert("Please select locations from the dropdown");
      return;
    }
    if (!departureDate) {
      alert("Please select departure date");
      return;
    }
    if (tripType === "round" && !returnDate) {
      alert("Please select return date");
      return;
    }

    const passengers = (e.target as HTMLFormElement).querySelector("#passengers") as HTMLSelectElement;

    setLoading(true);

    const params = new URLSearchParams({
      fromName: fromPlace.name,
      toName: toPlace.name,
      from: fromPlace.formatted_address,
      to: toPlace.formatted_address,
      fromLat: String(fromPlace.geometry.location.lat()),
      fromLng: String(fromPlace.geometry.location.lng()),
      toLat: String(toPlace.geometry.location.lat()),
      toLng: String(toPlace.geometry.location.lng()),
      departureDate,
      returnDate: tripType === "round" ? returnDate : "",
      passengers: passengers?.value || "1",
      tripType,
    });

    window.location.href = `/booking?${params.toString()}`;
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // ── Minimal Calendar ──────────────────────────────────────────
  const CustomCalendar = ({
    selectedDate,
    onDateChange,
    onClose,
    title,
  }: {
    selectedDate: string;
    onDateChange: (date: string) => void;
    onClose: () => void;
    title: string;
  }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [tempDate, setTempDate] = useState(selectedDate || "");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const MONTHS = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December",
    ];
    const DOWS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

    const year  = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay    = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const isSelected = (d: number) => {
      if (!tempDate) return false;
      return new Date(year, month, d).toDateString() === new Date(tempDate).toDateString();
    };

    const isToday = (d: number) =>
      new Date(year, month, d).toDateString() === today.toDateString();

    const isPast = (d: number) => new Date(year, month, d) < today;

    const handleDayClick = (d: number) => {
      if (isPast(d)) return;
      setTempDate(new Date(year, month, d).toISOString().split("T")[0]);
    };

    const handleConfirm = () => {
      if (tempDate) onDateChange(tempDate);
      onClose();
    };

    const formatFooter = (dateStr: string) => {
      if (!dateStr) return "—";
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        style={{ background: "rgba(0,0,0,0.3)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div
          className="bg-white rounded-2xl p-5"
          style={{ width: 300, border: "0.5px solid rgba(0,0,0,0.1)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm font-medium text-gray-800">
              {MONTHS[month]} {year}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 rounded-md hover:bg-gray-100 transition text-gray-400 hover:text-gray-800"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 rounded-md hover:bg-gray-100 transition text-gray-400 hover:text-gray-800"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Day of week labels ── */}
          <div className="grid grid-cols-7 mb-1">
            {DOWS.map((d) => (
              <div key={d} className="text-center pb-2" style={{ fontSize: 11, color: "#9ca3af", letterSpacing: "0.04em" }}>
                {d}
              </div>
            ))}
          </div>

          {/* ── Days grid ── */}
          <div className="grid grid-cols-7" style={{ gap: 2 }}>
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const sel   = isSelected(d);
              const tod   = isToday(d);
              const past  = isPast(d);

              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleDayClick(d)}
                  disabled={past}
                  className="relative flex items-center justify-center rounded-lg transition-all"
                  style={{
                    aspectRatio: "1",
                    fontSize: 13,
                    fontWeight: tod && !sel ? 500 : 400,
                    background: sel ? "#111827" : "transparent",
                    color: sel ? "#ffffff" : past ? "#d1d5db" : "#1f2937",
                    cursor: past ? "default" : "pointer",
                    border: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!past && !sel)
                      (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    if (!sel)
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  {d}
                  {tod && !sel && (
                    <span
                      className="absolute rounded-full"
                      style={{ width: 3, height: 3, background: "#111827", bottom: 3, left: "50%", transform: "translateX(-50%)" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Footer ── */}
          <div
            className="flex items-center justify-between mt-4 pt-4"
            style={{ borderTop: "0.5px solid #e5e7eb" }}
          >
            <div>
              <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>Selected</p>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>
                {formatFooter(tempDate)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleConfirm}
              style={{
                background: "#111827",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "7px 18px",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                opacity: tempDate ? 1 : 0.4,
                transition: "opacity .15s",
              }}
              disabled={!tempDate}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };
  // ── end CustomCalendar ────────────────────────────────────────

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl w-full flex flex-col sm:flex-row items-stretch sm:items-center overflow-hidden text-gray-700 shadow-lg"
      >
        <div className="flex-[2] flex items-center gap-2 px-4 py-3 sm:py-4 border-b sm:border-b-0 sm:border-r border-gray-200">
          <Image src="/images/from.png" alt="" width={14} height={14} />
          <input
            ref={fromRef}
            type="text"
            placeholder="From airport, hotel, airbnb"
            className="w-full outline-none text-sm sm:text-base py-2"
            onChange={() => { fromPlaceRef.current = null; }}
          />
        </div>

        <div className="flex-[2] flex items-center gap-2 px-4 py-3 sm:py-4 border-b sm:border-b-0 sm:border-r border-gray-200">
          <Image src="/images/to.png" alt="" width={18} height={18} />
          <input
            ref={toRef}
            type="text"
            placeholder="To airport, hotel, airbnb"
            className="w-full outline-none text-sm sm:text-base py-2"
            onChange={() => { toPlaceRef.current = null; }}
          />
        </div>

        <div
          onClick={() => setShowDepartureCalendar(true)}
          className="flex items-center gap-2 px-4 py-3 sm:py-4 flex-1 border-b sm:border-b-0 sm:border-r border-gray-200 cursor-pointer hover:bg-gray-50 transition"
        >
          <Image src="/images/calendar.png" alt="" width={18} height={18} />
          <span className="text-xs sm:text-sm">
            {departureDate ? formatDate(departureDate) : "Departure"}
          </span>
        </div>

        {tripType === "round" && (
          <div
            onClick={() => setShowReturnCalendar(true)}
            className="flex items-center gap-2 px-4 py-3 sm:py-4 flex-1 border-b sm:border-b-0 sm:border-r border-gray-200 cursor-pointer hover:bg-gray-50 transition"
          >
            <Image src="/images/calendar.png" alt="" width={18} height={18} />
            <span className="text-xs sm:text-sm">
              {returnDate ? formatDate(returnDate) : "Return"}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 px-4 py-3 sm:py-4 flex-1 border-b sm:border-b-0 sm:border-r border-gray-200">
          <Image src="/images/user.png" alt="" width={18} height={18} />
          <select
            id="passengers"
            className="w-full outline-none text-sm sm:text-base py-2 bg-white cursor-pointer"
          >
            {[...Array(19)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1} Passenger{i > 0 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#4ccb8c] text-white px-4 sm:px-8 py-3 sm:py-4 font-semibold w-full sm:w-auto transition hover:bg-[#3db37a] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {showDepartureCalendar && (
        <CustomCalendar
          selectedDate={departureDate}
          onDateChange={setDepartureDate}
          onClose={() => setShowDepartureCalendar(false)}
          title="Select departure date"
        />
      )}

      {tripType === "round" && showReturnCalendar && (
        <CustomCalendar
          selectedDate={returnDate}
          onDateChange={setReturnDate}
          onClose={() => setShowReturnCalendar(false)}
          title="Select return date"
        />
      )}
    </>
  );
}