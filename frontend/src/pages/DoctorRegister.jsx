import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config/api'

export default function DoctorRegister() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialty: '',
    experience: '',
    clinic: '',
    consultationFee: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_URL}/api/doctor/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Registration successful! Redirecting to login...')
        setTimeout(() => navigate('/doctor-login'), 2000)
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (err) {
      setError('Error registering: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-6">
      <section className="px-4 md:px-16 py-12 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-200 rounded-full opacity-20 -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-200 rounded-full opacity-20 -ml-36 -mb-36"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-cyan-100 text-cyan-600 rounded-full text-sm font-semibold">Doctor Access</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Doctor <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Registration</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
            Join our network of verified healthcare professionals and reach more patients.
          </p>
        </div>
      </section>

      <section className="px-4 md:px-16 py-16 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Create Your Account</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                {success}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Dr. John Doe"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="doctor@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Specialty</label>
                  <input
                    type="text"
                    name="specialty"
                    required
                    value={formData.specialty}
                    onChange={handleChange}
                    placeholder="Cardiology"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Experience (Years)</label>
                  <input
                    type="number"
                    name="experience"
                    required
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="10"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Clinic Name</label>
                  <input
                    type="text"
                    name="clinic"
                    required
                    value={formData.clinic}
                    onChange={handleChange}
                    placeholder="Your Clinic Name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    name="consultationFee"
                    required
                    value={formData.consultationFee}
                    onChange={handleChange}
                    placeholder="500"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 mt-6"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/doctor-login')}
                className="text-cyan-600 font-semibold hover:text-cyan-700"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
