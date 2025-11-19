import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config/api'

export default function FindDoctors() {
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${API_URL}/api/doctors`)
      const data = await response.json()
      setDoctors(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching doctors:', error)
      setLoading(false)
    }
  }

  const handleBookAppointment = (doctor) => {
    navigate('/book-appointment', { state: { selectedDoctor: doctor } })
  }

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 px-6 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>
      </section>

      <section className="px-4 md:px-16 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading verified doctors...</p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No verified doctors found. Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.map((doctor, index) => (
                <div key={doctor._id} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{doctor.name}</h3>
                  <p className="text-cyan-500 font-semibold mb-2">{doctor.specialty}</p>
                  <p className="text-gray-600 text-sm mb-4">Experience: {doctor.experience} years</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-yellow-500 font-semibold">⭐ {doctor.rating || 4.5}</span>
                    <span className="text-gray-600 text-sm">{doctor.totalPatients || 0}+ patients</span>
                  </div>
                  <p className="text-gray-600 text-xs mb-4">📍 {doctor.clinicName}</p>
                  <p className="text-gray-600 text-xs mb-4">💰 Consultation: ₹{doctor.consultationFee}</p>
                  <button 
                    onClick={() => handleBookAppointment(doctor)}
                    className="w-full bg-cyan-500 text-white font-semibold py-2 rounded-lg hover:bg-cyan-600 transition">
                    Book Appointment
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
