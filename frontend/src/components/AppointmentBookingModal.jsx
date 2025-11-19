import { useState, useEffect } from 'react'

export default function AppointmentBookingModal({ isOpen, onClose }) {
  const [doctors, setDoctors] = useState([])
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    patientAge: '',
    symptoms: '',
    doctorId: '',
    appointmentDate: '',
    consultationType: 'video'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchDoctors()
    }
  }, [isOpen])

  const fetchDoctors = async () => {
    try {
      const response = await fetch('https://medlife-backend-sable.vercel.app/api/doctors')
      const data = await response.json()
      setDoctors(data)
    } catch (err) {
      console.log('Error fetching doctors:', err)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch('https://medlife-backend-sable.vercel.app/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Booking failed')
        return
      }

      setSuccess('Appointment booked successfully! The doctor will contact you shortly.')
      setFormData({
        patientName: '',
        patientEmail: '',
        patientPhone: '',
        patientAge: '',
        symptoms: '',
        doctorId: '',
        appointmentDate: '',
        consultationType: 'video'
      })

      setTimeout(() => {
        onClose()
        setSuccess('')
      }, 2000)
    } catch (err) {
      setError('Connection error. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="w-full flex items-center justify-center p-4 overflow-y-auto bg-transparent">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Book an Appointment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Full Name</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500 transition text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Email</label>
              <input
                type="email"
                name="patientEmail"
                value={formData.patientEmail}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500 transition text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Phone Number</label>
              <input
                type="tel"
                name="patientPhone"
                value={formData.patientPhone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500 transition text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Age</label>
              <input
                type="number"
                name="patientAge"
                value={formData.patientAge}
                onChange={handleChange}
                placeholder="25"
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500 transition text-sm"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Select Doctor</label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500 transition text-sm"
                required
              >
                <option value="">Choose a doctor...</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Symptoms/Reason</label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                placeholder="Describe your symptoms or reason for appointment"
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500 transition text-sm"
                rows="3"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Appointment Date</label>
              <input
                type="datetime-local"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500 transition text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Consultation Type</label>
              <select
                name="consultationType"
                value={formData.consultationType}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500 transition text-sm"
              >
                <option value="video">Video Call</option>
                <option value="phone">Phone Call</option>
                <option value="in-person">In-Person</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 mt-6"
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  )
}
