"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import BookingForm from "@/components/BookingForm";

export default function Hero() {
  return (
    <section className="relative h-[75vh] flex flex-col px-8 md:px-20 py-10 font-[Manrope]">

      {/* Background */}
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

        {/* 1. Degradado de Izquierda a Derecha (el que ya tenías) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55  from-[10%] via-black/25 via-[25%] to-transparent" />

        {/* 2. Degradado de Arriba hacia Abajo */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60  from-[10%] via-black/25 via-[25%] to-transparent" />

        {/* 3. Degradado de Abajo hacia Arriba (para que el video no se corte brusco) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60  from-[10%] via-black/25 via-[25%] to-transparent" />
        </div>

      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="relative z-10 flex flex-col mt-0 ml-22 mr-22">

        {/* Title */}
        <h1 className="max-w-[850px] text-4xl md:text-[52px] font-semibold leading-tight mb-7 text-white">
          Private transportation & premium experiences in Los Cabos.
        </h1>

        {/* Options */}
        <div className="flex gap-8 mb-7 text-white text-lg h-10">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox"className="w-6 h-6 rounded-lg "/>
            One way
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-6 h-6 rounded-lg "/>
            Round trip
          </label>
        </div>

        {/* Search (TEMPORAL, luego lo conectamos con BookingForm) */}
        <BookingForm />

        <div className="mt-12 flex flex-col md:flex-row justify-center gap-82 text-white text-lg">

        <div className="flex items-center gap-3">
            <Image src="/images/booking.png" alt="" width={35} height={35} />
            Easy online booking
        </div>

        <div className="flex items-center gap-3">
            <Image src="/images/chat.png" alt="" width={35} height={35} />
            Bilingual chauffeurs
        </div>

        <div className="flex items-center gap-3">
            <Image src="/images/money.png" alt="" width={35} height={35} />
            No hidden fees
        </div>

        </div>

      </div>
    </section>
  );
}

