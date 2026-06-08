"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import BookingForm from "@/components/BookingForm";
import { useState } from "react";

export default function Hero() {
  const [tripType, setTripType] = useState("oneway");

  const handleTripTypeChange = (type) => {
    setTripType(type);
  };

  return (
    <section className="relative min-h-[90vh] sm:min-h-[85vh] md:min-h-[80vh] flex flex-col px-4 sm:px-6 md:px-10 lg:px-20 py-4 sm:py-6 md:py-10">
      {/* Fondo de video */}
      <div className="absolute inset-0 -z-10">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="/images/hero1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 from-[10%] via-black/25 via-[20%] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 from-[10%] via-black/25 via-[20%] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 from-[10%] via-black/25 via-[20%] to-transparent" />
      </div>

      <Navbar />

      {/* Contenedor principal */}
      <div className="relative z-10 flex flex-col flex-1 justify-center max-w-7xl mx-auto w-full pl-7 mt-0 md:mt-8">

        {/* Título (Se mantiene blanco para destacar jerarquía) */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-semibold tracking-[0.5px] leading-tight mb-5 sm:mb-30 text-white max-w-full md:max-w-[850px]">
          Private transportation & premium experiences in Los Cabos.
        </h1>

        {/* Radio buttons */}
        <div className="flex flex-wrap gap-6 sm:gap-8 mb-8">
          {[
            { value: "oneway", label: "One way" },
            { value: "round",  label: "Round trip" },
          ].map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => handleTripTypeChange(value)}
            >
              <span
                style={{
                  width:          24,
                  height:         24,
                  flexShrink:     0,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  background:     "#ffffff",
                  borderRadius:   3,
                  border:         "none",
                }}
              >
                {tripType === value && (
                  <span
                    style={{
                      width:        12,
                      height:       12,
                      borderRadius: 2,
                      background:   "#4ccb8c",
                      display:      "block",
                    }}
                  />
                )}
              </span>
              {/* CAMBIO: De text-white a text-gray-300 */}
              <span className="text-gray-300 font-semibold text-[20px]">
                {label}
              </span>
            </label>
          ))}
        </div>

        {/* Booking Form */}
        <BookingForm tripType={tripType} />

        {/* Features */}
        {/* CAMBIO: De text-white a text-gray-300 */}
        <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-5 sm:gap-0 text-gray-300 text-base sm:text-lg md:text-xl w-full mb-25">
          <div className="flex items-center gap-6">
            <Image src="/images/chat.png" alt="" width={30} height={30} className="sm:w-[30px] sm:h-[30px]" />
            <span className="font-normal tracking-wide">Easy online booking</span>
          </div>
          <div className="flex items-center gap-6">
            <Image src="/images/booking.png" alt="" width={30} height={30} className="sm:w-[30px] sm:h-[30px]" />
            <span className="font-normal tracking-wide">Bilingual chauffeurs</span>
          </div>
          <div className="flex items-center gap-6">
            <Image src="/images/money.png" alt="" width={30} height={30} className="sm:w-[30px] sm:h-[30px]" />
            <span className="font-normal tracking-wide">No hidden fees</span>
          </div>
        </div>

      </div>
    </section>
  );
}