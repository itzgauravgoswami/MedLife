export default function About() {
  return (
    <div className="pt-6">
      <section className="px-4 md:px-16 py-12 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-200 rounded-full opacity-20 -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-200 rounded-full opacity-20 -ml-36 -mb-36"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-cyan-100 text-cyan-600 rounded-full text-sm font-semibold">Who We Are</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            About <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">MedLife</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
            Revolutionizing healthcare through technology and compassion.
          </p>
        </div>
      </section>

      <section className="px-4 md:px-16 py-24 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              At MedLife, we believe that everyone deserves access to quality healthcare. Our mission is to bridge the gap between patients and healthcare providers through innovative technology and compassionate care.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              We're committed to making healthcare accessible, affordable, and convenient for everyone, anytime, anywhere.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden h-80 flex items-center justify-center">
            <img src="/p1.png" alt="Healthcare Professional" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section className="px-4 md:px-16 py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-16 text-center">Why Choose MedLife?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expertise</h3>
              <p className="text-gray-600">Access to certified and experienced healthcare professionals across all specialties.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Security</h3>
              <p className="text-gray-600">Your health data is encrypted and protected with industry-leading security standards.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Convenience</h3>
              <p className="text-gray-600">Schedule appointments, consult doctors, and manage health records all in one place.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
