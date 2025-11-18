export default function FindDoctors() {
  const doctors = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      experience: "15+ years",
      rating: 4.9,
      patients: "1200+"
    },
    {
      name: "Dr. Ahmed Khan",
      specialty: "Orthopedist",
      experience: "12+ years",
      rating: 4.8,
      patients: "980+"
    },
    {
      name: "Dr. Emily Rodriguez",
      specialty: "Neurologist",
      experience: "10+ years",
      rating: 4.9,
      patients: "850+"
    },
    {
      name: "Dr. James Wilson",
      specialty: "Pediatrician",
      experience: "8+ years",
      rating: 4.7,
      patients: "650+"
    },
    {
      name: "Dr. Lisa Chen",
      specialty: "Dermatologist",
      experience: "9+ years",
      rating: 4.8,
      patients: "720+"
    },
    {
      name: "Dr. Michael Brown",
      specialty: "General Practitioner",
      experience: "14+ years",
      rating: 4.9,
      patients: "1500+"
    }
  ];

  return (
    <div className="pt-6">
      <section className="px-4 md:px-16 py-12 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-200 rounded-full opacity-20 -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-200 rounded-full opacity-20 -ml-36 -mb-36"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-cyan-100 text-cyan-600 rounded-full text-sm font-semibold">Find Your Perfect Match</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Doctors</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mb-12 leading-relaxed">
            Connect with our network of qualified healthcare professionals across various specialties.
          </p>
          <input
            type="text"
            placeholder="Search by name or specialty..."
            className="w-full md:w-1/2 px-6 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>
      </section>

      <section className="px-4 md:px-16 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
                <div className="w-full h-40 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                  <img src={`/p${(index % 3) + 1}.png`} alt={doctor.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{doctor.name}</h3>
                <p className="text-cyan-500 font-semibold mb-2">{doctor.specialty}</p>
                <p className="text-gray-600 text-sm mb-4">Experience: {doctor.experience}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-yellow-500 font-semibold">⭐ {doctor.rating}</span>
                  <span className="text-gray-600 text-sm">{doctor.patients} patients</span>
                </div>
                <button className="w-full bg-cyan-500 text-white font-semibold py-2 rounded-lg hover:bg-cyan-600 transition">
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
