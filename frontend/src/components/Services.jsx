import { MdLocalHospital, MdHealthAndSafety, MdMedication, MdSchedule, MdAddCircle, MdAirlineSeatLegroomExtra } from 'react-icons/md';

export default function Services() {
  const services = [
    {
      icon: <MdAddCircle className="text-6xl text-cyan-500" />,
      title: "Online Consultation",
      description: "Connect with licensed doctors via video, phone, or chat. Get professional medical advice from home."
    },
    {
      icon: <MdSchedule className="text-6xl text-cyan-500" />,
      title: "Easy Appointment Booking",
      description: "Schedule appointments with specialist doctors at your preferred time without any hassle."
    },
    {
      icon: <MdAddCircle className="text-6xl text-cyan-500" />,
      title: "Prescription Management",
      description: "Receive and manage digital prescriptions directly through our secure platform."
    },
    {
      icon: <MdHealthAndSafety className="text-6xl text-cyan-500" />,
      title: "Health Records",
      description: "Store and access your complete medical history in one secure, organized place."
    },
    {
      icon: <MdAddCircle className="text-6xl text-cyan-500" />,
      title: "Lab Services",
      description: "Book home collection labs and get reports delivered directly to your dashboard."
    },
    {
      icon: <MdSchedule className="text-6xl text-cyan-500" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support to assist with any healthcare queries or issues."
    }
  ];

  return (
    <section className="px-4 md:px-16 py-24 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Top <span className="text-cyan-500">services</span> we offer
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Comprehensive healthcare solutions designed to meet all your medical needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl p-10 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
              <div className="mb-6 flex items-center justify-center h-20 w-20">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed text-center">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
