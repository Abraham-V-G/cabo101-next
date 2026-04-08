export default function Experience() {
  return (
    <section className="py-20 px-8 md:px-20 bg-gray-200">

      <div className="grid md:grid-cols-2 gap-10 items-center">

        <div>
          <h2 className="text-3xl font-semibold mb-6">
            Getting there should feel effortless as being there.
          </h2>

          <ul className="space-y-4 text-gray-700">
            <li>🛒 Grocery stop upon request</li>
            <li>🥤 Welcome drinks</li>
            <li>📍 Local tips and information</li>
          </ul>
        </div>

        <div>
          <img
            src="/images/video-preview.jpg"
            className="rounded-lg shadow"
          />
        </div>

      </div>

    </section>
  );
}
