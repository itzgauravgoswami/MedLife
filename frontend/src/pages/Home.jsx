import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaAmazon, FaApple, FaGoogle, FaMicrosoft, FaSpotify, FaSlack } from 'react-icons/fa';
import { MdCheckCircle, MdCloudUpload, MdAssignment } from 'react-icons/md';
import { BiSolidStar } from 'react-icons/bi';

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('')

  const handleBookAppointment = () => {
    navigate('/book-appointment')
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="px-4 md:px-16 py-24 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-gray-900">
              Your <span className="text-cyan-500">trusted partner</span> in digital healthcare.
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              Empowering Your Health at Every Step. Experience seamless healthcare with access to certified doctors and instant appointment booking.
            </p>

            <div className="flex gap-4 flex-col sm:flex-row">
              <button 
                onClick={handleBookAppointment}
                className="bg-cyan-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-cyan-500 transition">
                Book an Appointment →
              </button>
            </div>

            {/* Trust Badge */}
            <div className="flex gap-8 pt-4">
              <FaAmazon className="text-4xl text-gray-400 hover:text-gray-600 transition" />
              <FaApple className="text-4xl text-gray-400 hover:text-gray-600 transition" />
              <FaGoogle className="text-4xl text-gray-400 hover:text-gray-600 transition" />
              <FaMicrosoft className="text-4xl text-gray-400 hover:text-gray-600 transition" />
              <FaSpotify className="text-4xl text-gray-400 hover:text-gray-600 transition" />
              <FaSlack className="text-4xl text-gray-400 hover:text-gray-600 transition" />
            </div>
          </div>

          {/* Right Side - Doctor Image Circle */}
          <div className="relative flex justify-center">
            <div className="w-96 h-96 bg-cyan-300 rounded-full flex items-center justify-center relative shadow-2xl overflow-hidden">
              <img 
                src="/p1.png" 
                alt="Doctor"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Easy Booking Steps */}
      <section className="px-4 md:px-16 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            Easily book an appointment in 3 simple steps
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto text-lg">
            Our streamlined appointment system makes healthcare access simple and convenient
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                <MdCloudUpload className="text-3xl text-cyan-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Select Service</h3>
              <p className="text-gray-600">Choose from our wide range of medical services and specialists</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                <MdAssignment className="text-3xl text-cyan-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Schedule Time</h3>
              <p className="text-gray-600">Pick a convenient time slot that works best for you</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                <MdCheckCircle className="text-3xl text-cyan-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Get Confirmed</h3>
              <p className="text-gray-600">Receive instant confirmation and reminders for your appointment</p>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={handleBookAppointment}
              className="bg-cyan-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-cyan-500 transition"
            >
              Book Now →
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
