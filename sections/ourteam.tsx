// sections/ourteam.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
  const [isPaused, setIsPaused] = useState(false);

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

  // Duplicamos el arreglo para lograr el loop infinito sin salto visible:
  // el track se mueve exactamente el ancho de un set (translateX(-50%))
  // y al reiniciar la animación el segundo set ya está en la posición
  // donde empezaba el primero, así que no se nota el corte.
  const track = loading ? [] : [...items, ...items];

  // Velocidad proporcional a la cantidad de elementos, para que el
  // recorrido de cada tarjeta dure aprox. lo mismo sin importar cuántas
  // fotos/videos suba el admin.
  const durationSeconds = Math.max(items.length * 4, 18);

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
        {/* Misma etiqueta pequeña + título que el resto de las secciones
            (Experience, Popular Transfers, Testimonials), para que este
            carrusel se sienta parte del mismo sistema de diseño. */}
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
        <div
          className="relative w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Difuminados en los bordes para que el carrusel no corte
              abruptamente las tarjetas al entrar/salir de la pantalla */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10" />

          <div
            className="flex gap-6 w-max"
            style={{
              animationName: "ourTeamScroll",
              animationDuration: `${durationSeconds}s`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {track.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="relative flex-shrink-0 w-64 h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 bg-gray-100"
              >
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

                {/* Degradado inferior sutil siempre presente (tenga o no
                    caption), igual que en las tarjetas de Popular
                    Transfers, para que ambos carruseles compartan el
                    mismo lenguaje visual. */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm font-medium">
                      {item.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keyframes del carrusel infinito. Si prefieres tenerlos en
          app/globals.css en vez de inline, muévelos ahí — el resultado
          es el mismo. Se dejan aquí para que el componente sea
          autocontenido y no dependa de tocar otro archivo. */}
      <style jsx global>{`
        @keyframes ourTeamScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}