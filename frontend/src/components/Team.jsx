import { MdEmail } from 'react-icons/md';

export default function Team() {
  const doctors = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      bio: "Specializes in heart diseases with 15+ years of experience. Known for compassionate patient care."
    },
    {
      name: "Dr. Ahmed Khan",
      specialty: "Orthopedist",
      bio: "Expert in bone and joint disorders. Dedicated to helping patients regain mobility and strength."
    }
  ];

  return (
    <section className="px-4 md:px-16 py-24 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Masters of Medicine:
          </h2>
          <p className="text-cyan-500 text-lg font-semibold">
            Meet our team of specialists
          </p>
        </div>

        <div className="space-y-8">
          {doctors.map((doctor, index) => (
            <div key={index} className="bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center gap-8">
              {/* Doctor Image */}
              <div className="w-48 h-48 bg-white rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img 
                  src={index === 0 ? "/p1.png" : "/p3.png"} 
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Doctor Info */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{doctor.name}</h3>
                <p className="text-xl mb-4 opacity-90">{doctor.specialty}</p>
                <p className="text-lg mb-6 leading-relaxed">{doctor.bio}</p>
                <button className="bg-white text-cyan-500 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                  Book an Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
