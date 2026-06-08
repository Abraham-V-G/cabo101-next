export default function Experience() {
  const perks = [
    {
      icon: "/images/grocery.png",
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

  return (
    <section className="bg-white py-20 md:py-28 px-4 sm:px-6 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

        {/* Left — text */}
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
            {perks.map((perk, i) => (
              <li key={i} className="flex items-start gap-4">
                <img
                  src={perk.icon}
                  alt={perk.title}
                  className="w-8 h-8 object-contain flex-shrink-0 mt-0.5"
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

        {/* Right — video */}
        <div className="rounded-2xl overflow-hidden shadow-lg aspect-video">
          <video
            src="/images/experience-preview.mp4" /* Cambia esto por la ruta de tu video */
            poster="/images/cabo san lucas.jpg"   /* Imagen que se muestra antes de reproducir */
            className="w-full h-full object-cover"
            controls                             /* Muestra los controles (play, pausa, volumen) */
          />
        </div>

      </div>
    </section>
  );
}
