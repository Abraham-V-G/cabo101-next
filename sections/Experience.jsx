"use client";

import { useEffect, useState } from "react";

export default function Experience() {
  const [perks, setPerks] = useState([]);
  const [videoUrl, setVideoUrl] = useState("/images/experience-preview.mp4");

  useEffect(() => {
    fetch("/api/media")
      .then(res => res.json())
      .then(data => {
        console.log("📦 Datos de Experience:", data);
        
        // Íconos de experiencia
        const icons = data.filter(item => item.section === "experience-icons");
        setPerks(icons.map(p => ({
          icon: p.url,
          title: p.caption || "Title",
          description: p.description || "Description",
        })));

        // Video de experiencia
        const video = data.find(item => item.section === "experience-video" && item.url.endsWith(".mp4"));
        console.log("🎬 Video de Experience encontrado:", video);
        if (video) {
          setVideoUrl(video.url);
          console.log("✅ Video de Experience actualizado a:", video.url);
        }
      })
      .catch(console.error);
  }, []);

  const defaultPerks = [
    {
      icon: "/images/Grocery.png",
      title: "Grocery stop",
      description: "We'll swing by the market on the way — arrive stocked and ready.",
    },
    {
      icon: "/images/drinks.png",
      title: "Welcome drinks",
      description: "Cold refreshments waiting for you the moment you step in.",
    },
    {
      icon: "/images/tips.png",
      title: "Local insider tips",
      description: "Restaurants, beaches, hidden gems — from someone who actually lives here.",
    },
  ];

  const displayPerks = perks.length > 0 ? perks : defaultPerks;

  return (
    <section className="bg-white py-20 md:py-28 px-4 sm:px-6 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-teal-600 mb-4">
            The experience
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
            Getting there should feel as effortless as being there.
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-md">
            Every detail is taken care of before you arrive. No errands, no stress —
            just the start of your vacation.
          </p>
          <ul className="space-y-6">
            {displayPerks.map((perk, i) => (
              <li key={i} className="flex items-start gap-4">
                <img
                  src={perk.icon}
                  alt={perk.title}
                  className="w-8 h-8 object-contain flex-shrink-0 mt-0.5"
                  onError={(e) => {
                    // Si el ícono falla, no entra en bucle
                    if (!e.currentTarget.src.includes("placehold")) {
                      e.currentTarget.src = "https://placehold.co/32x32/cccccc/ffffff?text=?";
                    }
                  }}
                />
                <div>
                  <p className="text-gray-900 font-semibold text-sm mb-0.5">
                    {perk.title}
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg aspect-video">
          <video
            key={videoUrl} // 👈 FORZA RE-RENDER CUANDO CAMBIA LA URL
            src={videoUrl}
            poster="/images/cabo san lucas.jpg"
            className="w-full h-full object-cover"
            controls
            onLoadedData={() => console.log("✅ Video Experience cargado:", videoUrl)}
            onError={(e) => console.error("❌ Error cargando video Experience:", e)}
            preload="auto"
          />
        </div>
      </div>
    </section>
  );
}