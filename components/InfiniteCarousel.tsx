// components/InfiniteCarousel.tsx
"use client";

import { useState, ReactNode } from "react";

type InfiniteCarouselProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  itemKey: (item: T, index: number) => string | number;
  // Segundos de recorrido por elemento; junto con minDurationSeconds
  // controla qué tan rápido se mueve el carrusel según cuántos items haya.
  secondsPerItem?: number;
  minDurationSeconds?: number;
  gapClassName?: string;
  // Si es false, no se anima nada: se muestra una sola fila con scroll
  // horizontal nativo (swipe/drag/trackpad), sin loop ni duplicado de
  // items. Por defecto true, para no afectar a quien ya usa el
  // comportamiento original (Our Team, Testimonials).
  autoScroll?: boolean;
};

// Carrusel de scroll infinito basado en el patrón original de
// sections/ourteam.tsx: se duplica el arreglo de items y se anima
// translateX(0 -> -50%) en loop; como las dos mitades son idénticas, el
// "salto" al reiniciar la animación es invisible. Se pausa al pasar el
// mouse por encima. No usa botones de navegación — se recorre con
// swipe/drag o simplemente dejando que el auto-scroll continúe.
export default function InfiniteCarousel<T>({
  items,
  renderItem,
  itemKey,
  secondsPerItem = 4,
  minDurationSeconds = 18,
  gapClassName = "gap-6",
  autoScroll = true,
}: InfiniteCarouselProps<T>) {
  const [isPaused, setIsPaused] = useState(false);

  if (items.length === 0) return null;

  // Sin auto-scroll: una sola fila, sin duplicar, con scroll horizontal
  // nativo. No hace falta pausar nada porque no hay animación corriendo.
  if (!autoScroll) {
    return (
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10" />

        <div
          className={`carousel-no-scrollbar flex ${gapClassName} overflow-x-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32`}
        >
          {items.map((item, idx) => (
            <div key={itemKey(item, idx)} className="flex-shrink-0">
              {renderItem(item, idx)}
            </div>
          ))}
        </div>

        <style jsx>{`
          .carousel-no-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .carousel-no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    );
  }

  const track = [...items, ...items];
  const durationSeconds = Math.max(items.length * secondsPerItem, minDurationSeconds);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Difuminados en los bordes para que el carrusel no corte
          abruptamente los elementos al entrar/salir de la pantalla */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10" />

      <div
        className={`flex ${gapClassName} w-max`}
        style={{
          animationName: "infiniteCarouselScroll",
          animationDuration: `${durationSeconds}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {track.map((item, idx) => (
          <div key={`${itemKey(item, idx)}-${idx}`} className="flex-shrink-0">
            {renderItem(item, idx)}
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes infiniteCarouselScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}