export default function Testimonials() {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-10 lg:px-20 bg-white text-gray-800">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 md:mb-10">
          Rated Excellent by Our Travelers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-gray-50 p-5 sm:p-6 rounded shadow">
              <h3 className="font-semibold mb-2">John Doe</h3>
              <p className="text-sm text-gray-600">
                "Amazing experience, highly recommended!"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
