export default function Experience() {
  const perks = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Grocery stop",
      description: "We'll swing by the market on the way — arrive stocked and ready.",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Welcome drinks",
      description: "Cold refreshments waiting for you the moment you step in.",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Local insider tips",
      description: "Restaurants, beaches, hidden gems — from someone who actually lives here.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-stone-950 py-20 md:py-28 px-4 sm:px-6 md:px-10 lg:px-20">

      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:32px_32px]" />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

        {/* Left — text */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-teal-400 mb-4">
            The experience
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Getting there should feel as effortless as{" "}
            <span className="text-teal-400">being there.</span>
          </h2>

          <p className="text-stone-400 text-base leading-relaxed mb-10 max-w-md">
            Every detail is taken care of before you arrive. No errands, no stress —
            just the start of your vacation.
          </p>

          {/* Perks */}
          <ul className="space-y-6">
            {perks.map((perk, i) => (
              <li key={i} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                  {perk.icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm mb-0.5">
                    {perk.title}
                  </p>
                  <p className="text-stone-400 text-sm leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — image */}
        <div className="relative">

          {/* Decorative border frame */}
          <div className="absolute -top-4 -right-4 w-full h-full rounded-2xl border border-teal-500/20" />

          <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
            <img
              src="/images/video-preview.jpg"
              alt="Experience preview"
              className="w-full h-full object-cover"
            />

            {/* Overlay card */}
            <div className="absolute bottom-5 left-5 right-5 bg-black/60 backdrop-blur-md rounded-xl px-5 py-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-sm">
                    Private transfer included
                  </p>
                  <p className="text-stone-400 text-xs mt-0.5">
                    Door-to-door, just for you
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
