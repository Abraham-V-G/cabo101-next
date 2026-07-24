"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import BookingForm from "@/components/BookingForm";
import { useState, useEffect } from "react";

export default function Hero() {
  const [tripType, setTripType] = useState("oneway");
  const [videoUrl, setVideoUrl] = useState("/images/hero1.mp4");

  useEffect(() => {
    fetch("/api/media")
      .then(res => res.json())
      .then(data => {
        console.log("📦 Datos de /api/media:", data);
        const heroVideo = data.find(item => item.section === "hero" && item.url.endsWith(".mp4"));
        console.log("🎬 Video encontrado:", heroVideo);
        if (heroVideo) {
          setVideoUrl(heroVideo.url);
          console.log("✅ Video actualizado a:", heroVideo.url);
        }
      })
      .catch(console.error);
  }, []);

  const handleTripTypeChange = (type) => {
    setTripType(type);
  };

  return (
    <section className="relative min-h-[90vh] sm:min-h-[85vh] md:min-h-[80vh] flex flex-col px-4 sm:px-6 md:px-10 lg:px-20 py-4 sm:py-6 md:py-10">
      <div className="absolute inset-0 -z-10">
        <video 
          key={videoUrl} // 👈 FORZA RE-RENDER CUANDO CAMBIA LA URL
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover"
          onLoadedData={() => console.log("✅ Video cargado correctamente:", videoUrl)}
          onError={(e) => console.error("❌ Error cargando video:", e)}
          preload="auto"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        {/* Degradados de legibilidad sobre el video. En móvil se usan
            paradas más amplias y graduales (arrancan antes y se
            extienden más) para que el oscurecimiento se vea suave en
            vez de cortado; a partir de md: vuelve a las paradas
            originales, pensadas para pantallas anchas donde el texto
            vive a la izquierda y el video se ve limpio a la derecha. */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 from-[5%] via-black/30 via-[45%] to-transparent md:from-black/50 md:from-[10%] md:via-black/25 md:via-[20%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 from-[5%] via-black/30 via-[35%] to-transparent md:from-black/55 md:from-[10%] md:via-black/25 md:via-[20%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 from-[5%] via-black/30 via-[35%] to-transparent md:from-black/55 md:from-[10%] md:via-black/25 md:via-[20%]" />
      </div>

      <Navbar />

      <div className="relative z-10 flex flex-col flex-1 justify-center max-w-7xl mx-auto w-full px-5 sm:pl-7 sm:pr-0 mt-0 md:mt-8">
        <h1 className="text-[26px] tracking-normal sm:text-4xl sm:tracking-[0.5px] md:text-5xl lg:text-[100px] font-semibold leading-tight mb-5 sm:mb-30 text-white max-w-full md:max-w-[850px]">
          Private transportation & premium experiences in Los Cabos.
        </h1>

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
                  width: 22,
                  height: 22,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#ffffff",
                  borderRadius: 3,
                  border: "none",
                }}
              >
                {tripType === value && (
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: "#4ccb8c",
                      display: "block",
                    }}
                  />
                )}
              </span>
              <span className="text-gray-300 font-semibold text-[20px]">
                {label}
              </span>
            </label>
          ))}
        </div>

        <BookingForm tripType={tripType} />

        <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row justify-between items-start sm:items-start mx-auto sm:mx-0 w-fit sm:w-full gap-5 sm:gap-0 text-gray-300 text-lg sm:text-sm md:text-xl mb-25">
          <div className="flex items-center gap-6">
            <Image src="/images/chat1.png" alt="" width={29} height={29} className="sm:w-[29px] sm:h-[28px]" />
            <span className="font-normal tracking-wide">Easy online booking</span>
          </div>
          <div className="flex items-center gap-6">
            <Image src="/images/booking.png" alt="" width={28} height={28} className="sm:w-[27px] sm:h-[27px]" />
            <span className="font-normal tracking-wide">Bilingual chauffeurs</span>
          </div>
          <div className="flex items-center gap-6">
            <Image src="/images/money.png" alt="" width={28} height={28} className="sm:w-[27px] sm:h-[27px]" />
            <span className="font-normal tracking-wide">No hidden fees</span>
          </div>
        </div>
      </div>
    </section>
  );
}