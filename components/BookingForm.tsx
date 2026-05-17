// components/BookingForm.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import useGoogleMaps from "@/lib/useGoogleMaps"; // FIX: importar el hook

declare global {
  interface Window {
    google: any;
  }
}

export default function BookingForm({ tripType }: { tripType: "oneway" | "round" }) {
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [showDepartureCalendar, setShowDepartureCalendar] = useState(false);
  const [showReturnCalendar, setShowReturnCalendar] = useState(false);

  // FIX: usar el hook para saber cuándo Maps está listo
  const mapsLoaded = useGoogleMaps();

  useEffect(() => {
    // FIX: solo inicializar cuando mapsLoaded sea true
    if (!mapsLoaded || !window.google?.maps?.places) return;

    try {
      const options = {
        componentRestrictions: { country: "mx" },
        bounds: new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(22.5, -110.5),
          new window.google.maps.LatLng(25.5, -108.5)
        ),
        strictBounds: true,
        fields: ["geometry", "formatted_address"],
      };

      if (fromRef.current) {
        const fromAuto = new window.google.maps.places.Autocomplete(
          fromRef.current,
          options
        );
        fromAuto.addListener("place_changed", () => {
          const place = fromAuto.getPlace();
          if (place?.geometry && fromRef.current) {
            fromRef.current.value = place.formatted_address;
          }
        });
      }

      if (toRef.current) {
        const toAuto = new window.google.maps.places.Autocomplete(
          toRef.current,
          options
        );
        toAuto.addListener("place_changed", () => {
          const place = toAuto.getPlace();
          if (place?.geometry && toRef.current) {
            toRef.current.value = place.formatted_address;
          }
        });
      }
    } catch (error) {
      console.error("Error inicializando Google Places:", error);
    }
  // FIX: mapsLoaded como dependencia — se ejecuta cuando Maps termina de cargar
  }, [mapsLoaded]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const from = fromRef.current?.value;
    const to = toRef.current?.value;
    const passengers = (e.target as HTMLFormElement).querySelector(
      "#passengers"
    ) as HTMLSelectElement;
    const passengersValue = passengers?.value || "1";

    if (!from || !to) {
      alert("Please select locations");
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

    setLoading(true);
    const params = new URLSearchParams({
      from,
      to,
      departureDate,
      returnDate: tripType === "round" ? returnDate : "",
      passengers: passengersValue,
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

    const getDaysInCurrentMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const lastDay = new Date(year, month + 1, 0);
      const days = [];
      for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i));
      }
      return days;
    };

    const getFirstDayOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const isSelected = (date: Date) => {
      if (!tempDate) return false;
      return date.toDateString() === new Date(tempDate).toDateString();
    };

    const isToday = (date: Date) =>
      date.toDateString() === new Date().toDateString();

    const isPastDate = (date: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    };

    const handleDateClick = (date: Date, e: React.MouseEvent) => {
      e.stopPropagation();
      if (isPastDate(date)) return;
      setTempDate(date.toISOString().split("T")[0]);
    };

    const handleConfirm = () => {
      if (tempDate) onDateChange(tempDate);
      onClose();
    };

    const changeMonth = (increment: number) => {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1)
      );
    };

    const monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December",
    ];
    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const daysInMonth = getDaysInCurrentMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const calendarCells: { date: Date | null }[] = [];

    for (let i = 0; i < firstDayOfMonth; i++)
      calendarCells.push({ date: null });
    for (const d of daysInMonth)
      calendarCells.push({ date: d });
    while (calendarCells.length < 42)
      calendarCells.push({ date: null });

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-[400px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
              >←</button>
              <span className="font-semibold text-gray-800">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
              >→</button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((cell, idx) => {
                if (!cell.date)
                  return <div key={idx} className="aspect-square rounded-lg" />;
                const date = cell.date;
                const isSelectedDay = isSelected(date);
                const isTodayDay = isToday(date);
                const isPast = isPastDate(date);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => handleDateClick(date, e)}
                    disabled={isPast}
                    className={`
                      aspect-square rounded-lg text-sm font-medium transition-all cursor-pointer
                      ${isPast ? "text-gray-300 cursor-not-allowed bg-gray-50" : "hover:bg-teal-50"}
                      ${isSelectedDay ? "bg-teal-600 text-white hover:bg-teal-700" : "text-gray-700"}
                      ${isTodayDay && !isSelectedDay ? "border-2 border-teal-600" : ""}
                    `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="p-4 border-t flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >Cancel</button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition cursor-pointer"
            >Confirm</button>
          </div>
        </div>
      </div>
    );
  };

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
          />
        </div>

        <div className="flex-[2] flex items-center gap-2 px-4 py-3 sm:py-4 border-b sm:border-b-0 sm:border-r border-gray-200">
          <Image src="/images/to.png" alt="" width={18} height={18} />
          <input
            ref={toRef}
            type="text"
            placeholder="To airport, hotel, airbnb"
            className="w-full outline-none text-sm sm:text-base py-2"
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