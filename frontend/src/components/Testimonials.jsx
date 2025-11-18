import { BiSolidStar } from 'react-icons/bi';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      content: "The platform made scheduling my doctor's appointment incredibly easy. I was seen within 48 hours and received excellent care. Highly recommended!",
      rating: 5
    },
    {
      name: "Dr. Michael Chen",
      role: "Healthcare Provider",
      content: "As a doctor, I appreciate how this platform streamlines patient management. It saves time and improves patient satisfaction significantly.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Patient",
      content: "I had a great experience with the virtual consultation feature. The doctor was professional and thorough. Will definitely use again.",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "Patient",
      content: "Best healthcare platform I've used. Everything is intuitive and the customer support is fantastic. Worth every penny!",
      rating: 5
    }
  ];

  return (
    <section className="px-4 md:px-16 py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Patient Testimonials
          </h2>
          <p className="text-cyan-500 text-lg font-semibold mb-3">
            Hear from Those We've Cared For
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real stories from real patients who experienced excellence in healthcare
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <BiSolidStar key={i} className="text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold text-cyan-500 mb-2">10,000+</h3>
            <p className="text-gray-600">Happy Patients</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-cyan-500 mb-2">2,500+</h3>
            <p className="text-gray-600">Doctors</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-cyan-500 mb-2">98%</h3>
            <p className="text-gray-600">Satisfaction Rate</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-cyan-500 mb-2">200+</h3>
            <p className="text-gray-600">Hospitals</p>
          </div>
        </div>
      </div>
    </section>
  );
}
