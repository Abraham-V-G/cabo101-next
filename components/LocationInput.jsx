"use client";

import { useEffect, useRef } from "react";
import { isPointInBCS } from "@/lib/geo";

export default function LocationInput({ onSelect, placeholder }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!window.google) return;

    const ac = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "mx" },
      fields: ["place_id", "geometry", "formatted_address", "name"],
    });

    ac.addListener("place_changed", () => {
      const place = ac.getPlace();

      if (!place.geometry) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      if (!isPointInBCS(lat, lng)) {
        alert("Only Baja California Sur allowed");
        inputRef.current.value = "";
        return;
      }

      onSelect({
        lat,
        lng,
        address: place.formatted_address,
        name: place.name,
      });
    });
  }, []);

  return (
    <input
      ref={inputRef}
      placeholder={placeholder}
      className="flex-1 px-4 outline-none"
    />
  );
}
