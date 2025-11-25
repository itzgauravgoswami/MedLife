import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API_URL from '../config/api'

export default function DoctorLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/doctor/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok && data.token) {
        localStorage.setItem('doctorToken', data.token)
        localStorage.setItem('doctorData', JSON.stringify(data.doctor))
        login(data.token, data.doctor, 'doctor')
        navigate('/doctor-admin')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      setError('Error logging in: ' + err.message)
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
            Doctor <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Login</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
            Access your doctor dashboard to manage appointments, blogs, and your profile.
          </p>
        </div>
      </section>

      <section className="px-4 md:px-16 py-16 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Login to Your Account</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/doctor-register')}
                className="text-cyan-600 font-semibold hover:text-cyan-700"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
