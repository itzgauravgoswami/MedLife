export default function Stats() {
  return (
    <section className="px-4 md:px-16 py-24 bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
          By The Numbers
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <h3 className="text-5xl font-bold text-cyan-500 mb-3">50K+</h3>
            <p className="text-gray-700 font-semibold">Happy Patients</p>
          </div>

          <div className="text-center">
            <h3 className="text-5xl font-bold text-cyan-500 mb-3">1000+</h3>
            <p className="text-gray-700 font-semibold">Hospitals Network</p>
          </div>

          <div className="text-center">
            <h3 className="text-5xl font-bold text-cyan-500 mb-3">5000+</h3>
            <p className="text-gray-700 font-semibold">Certified Doctors</p>
          </div>

          <div className="text-center">
            <h3 className="text-5xl font-bold text-cyan-500 mb-3">24/7</h3>
            <p className="text-gray-700 font-semibold">Customer Support</p>
          </div>
        </div>
      </div>
    </section>
  );
}
