// lib/useGoogleMaps.js
"use client";

import { useEffect, useState } from "react";

export default function useGoogleMaps() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // FIX: protección SSR
    if (typeof window === "undefined") return;

    // Ya estaba cargado
    if (window.google?.maps) {
      setLoaded(true);
      return;
    }

    // FIX: evitar cargar el script dos veces si ya existe en el DOM
    const existing = document.querySelector(
      `script[src*="maps.googleapis.com"]`
    );
    if (existing) {
      existing.addEventListener("load", () => setLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    script.onerror = () => console.error("Error cargando Google Maps");

    document.body.appendChild(script);
  }, []);

  return loaded;
}
