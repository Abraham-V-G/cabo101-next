"use client";

import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function PopularTransfers() {
  const router = useRouter();

  const transfers = [
    {
      title: "San José del Cabo",
      price: "$90 USD",
      image: "/images/transfer.jpg",
    },
    {
      title: "Cabo San Lucas",
      price: "$110 USD",
      image: "/images/transfer.jpg",
    },
    {
      title: "Todos Santos",
      price: "$210 USD",
      image: "/images/transfer.jpg",
    },
    {
      title: "La Paz",
      price: "$250 USD",
      image: "/images/transfer.jpg",
    },
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
    <section className="py-20 px-8 md:px-45 bg-gray-100">

      {/* Title */}
      <h2 className="text-3xl font-semibold mb-2">
        Popular Airport Transfers
      </h2>

      <p className="text-gray-500 mb-10">
        Choose your route and enjoy a comfortable trip
      </p>

      {/* Swiper */}
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        spaceBetween={20}
        breakpoints={{
          320: { slidesPerView: 1.2 },
          768: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
        }}
      >
        {transfers.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white rounded-xl shadow-md overflow-hidden group transition">

              {/* Image */}
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-10 h-48 object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">

                <h3 className="font-semibold text-lg">
                  Airport - {item.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {item.price} Round Trip
                </p>

                <button
                  onClick={() => handleBooking(item.title)}
                  className="mt-3 w-full bg-teal-700 hover:bg-teal-800 text-white py-2 rounded-lg transition"
                >
                  BOOK NOW
                </button>

              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </section>
  );
}
