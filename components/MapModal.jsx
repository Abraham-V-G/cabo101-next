"use client";

import { useEffect, useRef } from "react";

export default function MapModal({ isOpen, onClose, onSelect }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !window.google) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 23.061, lng: -109.697 }, // San José
      zoom: 10,
    });

    let marker;

    map.addListener("click", (e) => {
      const position = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };

      if (marker) marker.setMap(null);

      marker = new google.maps.Marker({
        position,
        map,
      });

      // Reverse geocoding
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ location: position }, (results, status) => {
        if (status === "OK" && results[0]) {
          onSelect({
            ...position,
            address: results[0].formatted_address,
          });
        }
      });
    });

  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl w-[90%] max-w-3xl p-4">

        <div className="flex justify-between mb-3">
          <h2 className="font-semibold">Select location</h2>
          <button onClick={onClose}>✖</button>
        </div>

        <div ref={mapRef} className="w-full h-[400px] rounded-lg" />

      </div>
    </div>
  );
}
