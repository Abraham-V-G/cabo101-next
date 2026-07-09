// sections/ourteam.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import InfiniteCarousel from "@/components/InfiniteCarousel";

type Photo = {
  id: number;
  url: string;
  section: string;
  order: number;
  caption: string | null;
};

// Debe coincidir con el value del <option> agregado en app/admin/photos/page.tsx
const SECTION = "our-team";

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov)$/i.test(url);
}

export default function OurTeam() {
  const [items, setItems] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch(`/api/photos?section=${SECTION}`)
      .then((res) => res.json())
      .then((data: Photo[]) => {
        if (active) setItems(data);
      })
      .catch((err) => console.error("Error cargando Our Team:", err))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Nada configurado todavía por el admin: no mostramos la sección vacía.
  if (!loading && items.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-20 mb-10 text-center sm:text-left">
        <p className="text-xs font-semibold tracking-widest uppercase text-teal-600 mb-3">
          Behind The Scenes
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          This is Cabo 101
        </h2>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : (
        <InfiniteCarousel
          items={items}
          itemKey={(item) => item.id}
          renderItem={(item) => (
            <div className="relative w-64 h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 bg-gray-100">
              {isVideoUrl(item.url) ? (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <Image
                  src={item.url}
                  alt={item.caption || "Nuestro equipo"}
                  fill
                  sizes="(max-width: 768px) 256px, 288px"
                  className="object-cover"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white text-sm font-medium">{item.caption}</p>
                </div>
              )}
            </div>
          )}
        />
      )}
    </section>
  );
}