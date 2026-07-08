"use client";

import { useEffect, useState } from "react";

export default function Experience() {
  const [perks, setPerks] = useState([]);
  const [videoUrl, setVideoUrl] = useState("/images/experience-preview.mp4");
  const [showVideoModal, setShowVideoModal] = useState(false);

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

  // Cerrar el modal con la tecla Escape, para que no se sienta atrapado
  useEffect(() => {
    if (!showVideoModal) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setShowVideoModal(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showVideoModal]);

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

        {/* Vista previa del video: sin controles, en loop y muteado,
            con un eslogan "How it works" y un botón de play encima. Al
            hacer clic se abre el modal con el video completo y todos
            los controles nativos (play/pausa, volumen, tiempo, pantalla
            completa). */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-lg aspect-video cursor-pointer group"
          onClick={() => setShowVideoModal(true)}
          role="button"
          tabIndex={0}
          aria-label="Play video: How it works"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setShowVideoModal(true);
          }}
        >
          <video
            key={videoUrl} // 👈 FORZA RE-RENDER CUANDO CAMBIA LA URL
            src={videoUrl}
            poster="/images/cabo san lucas.jpg"
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={() => console.log("✅ Video Experience cargado:", videoUrl)}
            onError={(e) => console.error("❌ Error cargando video Experience:", e)}
          />

          {/* Overlay con eslogan + botón de play */}
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors duration-300 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600 translate-x-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-white text-lg sm:text-xl font-semibold tracking-wide drop-shadow">
              How it works
            </p>
          </div>
        </div>
      </div>

      {/* Modal del video con controles completos */}
      {showVideoModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-10 right-0 text-white text-3xl leading-none hover:text-gray-300 transition-colors"
              aria-label="Close video"
            >
              ×
            </button>
            <video
              src={videoUrl}
              className="w-full rounded-2xl shadow-2xl"
              controls
              autoPlay
              playsInline
            />
          </div>
        </div>
      )}
    </section>
  );
}