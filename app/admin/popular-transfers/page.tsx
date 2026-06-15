//app/admin/popular-transfers/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface Transfer {
  title: string;
  slug: string;
  subtitle: string;
  price: string;
  tag: string | null;
  image: string;
}

export default function PopularTransfers() {
  const router = useRouter();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/popular-transfers")
      .then((res) => res.json())
      .then((data) => {
        setTransfers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading transfers:", error);
        setLoading(false);
      });
  }, []);

  const handleBooking = (destinationName: string) => {
    const query = new URLSearchParams({
      from: "Airport",
      to: destinationName,
      passengers: "1",
    }).toString();
    router.push(`/booking?${query}`);
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">Cargando destinos...</div>
      </section>
    );
  }

  if (transfers.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-teal-600 mb-2">
              Airport Transfers
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              Where are you heading?
            </h2>
          </div>
          <p className="text-sm text-gray-400 sm:text-right max-w-xs">
            Private, door-to-door transfers with professional drivers
          </p>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          spaceBetween={20}
          slidesPerView={1.1}
          breakpoints={{
            480: { slidesPerView: 1.3, spaceBetween: 16 },
            640: { slidesPerView: 1.8, spaceBetween: 20 },
            768: { slidesPerView: 2.2, spaceBetween: 20 },
            1024: { slidesPerView: 2.8, spaceBetween: 24 },
            1280: { slidesPerView: 3.2, spaceBetween: 24 },
          }}
        >
          {transfers.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="group relative rounded-2xl overflow-hidden cursor-pointer h-[380px] sm:h-[420px] shadow-sm hover:shadow-xl transition-shadow duration-500">
                {/* Background image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/fallback.jpg";
                  }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Tag badge */}
                {item.tag && (
                  <div className="absolute top-4 left-4 bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {item.tag}
                  </div>
                )}

                {/* Price badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 text-sm font-bold px-3 py-1.5 rounded-xl shadow-sm">
                  {item.price}
                  <span className="block text-[10px] font-normal text-gray-500 leading-none mt-0.5 text-center">
                    Round Trip
                  </span>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  {/* Route info */}
                  <div className="flex items-center gap-1.5 text-white/60 text-xs mb-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Los Cabos Airport</span>
                    <svg className="w-3 h-3 mx-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-white/80">{item.title}</span>
                  </div>

                  <h3 className="text-white text-xl font-bold leading-tight mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-xs mb-4">{item.subtitle}</p>

                  {/* Book button */}
                  <button
                    onClick={() => handleBooking(item.title)}
                    className="w-full bg-white text-gray-900 hover:bg-teal-500 hover:text-white text-sm font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Book this transfer
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}