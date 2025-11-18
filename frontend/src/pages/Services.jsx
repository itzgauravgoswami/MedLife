export default function Services() {
  const services = [
    {
      title: "Online Consultation",
      description: "Connect with licensed doctors via video, phone, or chat. Get professional medical advice from home.",
      icon: "🏥"
    },
    {
      title: "Easy Appointment Booking",
      description: "Schedule appointments with specialist doctors at your preferred time without any hassle.",
      icon: "📅"
    },
    {
      title: "Prescription Management",
      description: "Receive and manage digital prescriptions directly through our secure platform.",
      icon: "💊"
    },
    {
      title: "Health Records",
      description: "Store and access your complete medical history in one secure, organized place.",
      icon: "📋"
    },
    {
      title: "Lab Services",
      description: "Book home collection labs and get reports delivered directly to your dashboard.",
      icon: "🔬"
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock customer support to assist with any healthcare queries or issues.",
      icon: "📞"
    }
  ];

  return (
    <div className="pt-6">
      <section className="px-4 md:px-16 py-12 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-200 rounded-full opacity-20 -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-200 rounded-full opacity-20 -ml-30 -mb-30"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-600 rounded-full text-xs font-semibold">Healthcare Solutions</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Our <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Services</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Comprehensive healthcare solutions designed to meet all your medical needs and improve your quality of life.
          </p>
        </div>
      </section>

      <section className="px-4 md:px-16 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-10 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
