"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import BookingForm from "@/components/BookingForm";
import { useState } from "react";

export default function Hero() {
  const [tripType, setTripType] = useState("oneway"); // Sin tipos

  const handleTripTypeChange = (type) => { // Sin tipos
    setTripType(type);
  };

  return (
    <section className="relative min-h-[90vh] sm:min-h-[85vh] md:min-h-[80vh] flex flex-col px-4 sm:px-6 md:px-10 lg:px-20 py-4 sm:py-6 md:py-10">
      {/* Fondo de video */}
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/images/hero1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 from-[10%] via-black/25 via-[25%] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 from-[10%] via-black/25 via-[25%] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 from-[10%] via-black/25 via-[25%] to-transparent" />
      </div>

      <Navbar />

      {/* Contenedor principal */}
      <div className="relative z-10 flex flex-col flex-1 justify-center max-w-7xl mx-auto w-full mt-4 md:mt-8">
        
        {/* Título */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-semibold leading-tight mb-4 sm:mb-6 text-white max-w-full md:max-w-[850px]"
          style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600 }}
        >
          Private transportation & premium experiences in Los Cabos.
        </h1>

        {/* Radio buttons */}
        <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 mb-6 text-white text-base sm:text-lg">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tripType"
              checked={tripType === "oneway"}
              onChange={() => handleTripTypeChange("oneway")}
              className="w-5 h-5 sm:w-6 sm:h-6 accent-teal-500"
            />
            <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600 }}>One way</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tripType"
              checked={tripType === "round"}
              onChange={() => handleTripTypeChange("round")}
              className="w-5 h-5 sm:w-6 sm:h-6 accent-teal-500"
            />
            <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600 }}>Round trip</span>
          </label>
        </div>

        {/* Booking Form */}
        <BookingForm tripType={tripType} />

        {/* Features */}
        <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row justify-center items-center sm:items-start gap-5 sm:gap-8 md:gap-12 lg:gap-16 text-white text-sm sm:text-base md:text-lg">
          <div className="flex items-center gap-3">
            <Image src="/images/booking.png" alt="" width={30} height={30} className="sm:w-[35px] sm:h-[35px]" />
            <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600 }}>Easy online booking</span>
          </div>
          <div className="flex items-center gap-3">
            <Image src="/images/chat.png" alt="" width={30} height={30} className="sm:w-[35px] sm:h-[35px]" />
            <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600 }}>Bilingual chauffeurs</span>
          </div>
          <div className="flex items-center gap-3">
            <Image src="/images/money.png" alt="" width={30} height={30} className="sm:w-[35px] sm:h-[35px]" />
            <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600 }}>No hidden fees</span>
          </div>
        </div>
      </div>
    </section>
  );
}