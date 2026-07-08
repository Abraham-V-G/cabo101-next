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
}: InfiniteCarouselProps<T>) {
  const [isPaused, setIsPaused] = useState(false);

  if (items.length === 0) return null;

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