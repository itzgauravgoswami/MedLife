import { useState } from 'react'

export default function DoctorRegisterModal({ isOpen, onClose, onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: '',
    experience: '',
    qualifications: '',
    phoneNumber: '',
    clinicName: '',
    clinicAddress: '',
    consultationFee: '',
    registrationNumber: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('https://medlife-backend-sable.vercel.app/api/doctor/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Registration failed')
        return
      }

      setFormData({
        name: '',
        email: '',
        password: '',
        specialty: '',
        experience: '',
        qualifications: '',
        phoneNumber: '',
        clinicName: '',
        clinicAddress: '',
        consultationFee: '',
        registrationNumber: ''
      })
      onRegisterSuccess()
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
          <h2 className="text-2xl font-bold text-gray-900">Doctor Registration</h2>
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

        <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. John Doe"
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500 transition text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500 transition text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500 transition text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Specialty</label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="Cardiologist"
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500 transition text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Experience (years)</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="10+ years"
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500 transition text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Qualifications</label>
              <input
                type="text"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                placeholder="MD, MBBS"
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500 transition text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500 transition text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Registration Number</label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                placeholder="NMC/REG/1234"
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500 transition text-sm"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Clinic Name</label>
              <input
                type="text"
                name="clinicName"
                value={formData.clinicName}
                onChange={handleChange}
                placeholder="Heart Care Clinic"
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500 transition text-sm"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Clinic Address</label>
              <input
                type="text"
                name="clinicAddress"
                value={formData.clinicAddress}
                onChange={handleChange}
                placeholder="123 Medical Plaza, City"
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500 transition text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Consultation Fee (₹)</label>
              <input
                type="number"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
                placeholder="500"
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-cyan-500 transition text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 mt-6"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4 text-sm">
          Your registration will be reviewed by the admin. You'll receive an email once verified.
        </p>
      </div>
    </div>
  )
}
