export default function Experience() {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-10 lg:px-20 bg-gray-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">
            Getting there should feel effortless as being there.
          </h2>
          <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
            <li>🛒 Grocery stop upon request</li>
            <li>🥤 Welcome drinks</li>
            <li>📍 Local tips and information</li>
          </ul>
        </div>
        <div className="mt-6 md:mt-0">
          <img
            src="/images/video-preview.jpg"
            alt="Experience preview"
            className="rounded-lg shadow-md w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
