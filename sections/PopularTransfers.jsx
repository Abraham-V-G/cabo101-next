"use client";

import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function PopularTransfers() {
  const router = useRouter();

  const transfers = [
    { title: "San José del Cabo", price: "$90 USD", image: "/images/transfer.jpg" },
    { title: "Cabo San Lucas", price: "$110 USD", image: "/images/transfer.jpg" },
    { title: "Todos Santos", price: "$210 USD", image: "/images/transfer.jpg" },
    { title: "La Paz", price: "$250 USD", image: "/images/transfer.jpg" },
  ];

  const handleBooking = (destination) => {
    const query = new URLSearchParams({
      from: "Airport",
      to: destination,
      passengers: "1",
    }).toString();
    router.push(`/booking?${query}`);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-2">
          Popular Airport Transfers
        </h2>
        <p className="text-gray-500 mb-6 sm:mb-8 md:mb-10">
          Choose your route and enjoy a comfortable trip
        </p>
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          spaceBetween={16}
          breakpoints={{
            480: { slidesPerView: 1.2, spaceBetween: 16 },
            640: { slidesPerView: 1.5, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 2.5, spaceBetween: 24 },
            1280: { slidesPerView: 3, spaceBetween: 24 },
          }}
        >
          {transfers.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden group transition h-full flex flex-col">
                <div className="overflow-hidden h-48 sm:h-52 md:h-48">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-base sm:text-lg">
                    Airport - {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.price} Round Trip
                  </p>
                  <button
                    onClick={() => handleBooking(item.title)}
                    className="mt-4 w-full bg-teal-700 hover:bg-teal-800 text-white py-2 rounded-lg transition text-sm sm:text-base"
                  >
                    BOOK NOW
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