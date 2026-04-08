export default function Testimonials() {
  return (
    <section className="py-20 px-8 md:px-20 bg-white text-gray-800">

      <h2 className="text-3xl font-semibold mb-10">
        Rated Excellent by Our Travelers
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        {[1,2,3].map((item) => (
          <div key={item} className="bg-gray-50 p-6 rounded shadow">

            <h3 className="font-semibold mb-2">John Doe</h3>

            <p className="text-sm text-gray-600">
              "Amazing experience, highly recommended!"
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}
