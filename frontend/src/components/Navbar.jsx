import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDoctorDropdownOpen, setIsDoctorDropdownOpen] = useState(false)
  const [doctorToken, setDoctorToken] = useState(localStorage.getItem('doctorToken'))

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Find Doctors', href: '/find-doctors' },
    { label: 'Medicines', href: '/medicines' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  const handleLogoutDoctor = () => {
    localStorage.removeItem('doctorToken')
    localStorage.removeItem('doctorData')
    setDoctorToken(null)
    setIsDoctorDropdownOpen(false)
  }

  const handleDoctorAdminAccess = () => {
    if (doctorToken) {
      navigate('/doctor-admin')
      setIsDoctorDropdownOpen(false)
    } else {
      navigate('/doctor-login')
    }
  }

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-md">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2V18M4 10H16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-bold text-blue-600 hidden sm:block">MedLife</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.href}
                className="text-gray-700 font-medium text-sm hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Book Appointment Button */}
            <button
              onClick={() => navigate('/book-appointment')}
              className="hidden sm:flex bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold px-6 py-2 rounded-lg hover:shadow-lg transition-all text-sm"
            >
              Book Appointment
            </button>

            {/* Doctor Dropdown */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsDoctorDropdownOpen(!isDoctorDropdownOpen)}
                className="flex items-center gap-2 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                {doctorToken ? '👨‍⚕️ Doctor' : '🔐 Doctor'}
                <span className={`text-xs transition-transform ${isDoctorDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {/* Dropdown Menu */}
              {isDoctorDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  {doctorToken ? (
                    <>
                      <button
                        onClick={handleDoctorAdminAccess}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 font-medium"
                      >
                        👨‍💼 My Dashboard
                      </button>
                      <button
                        onClick={handleLogoutDoctor}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-gray-700 font-medium border-t"
                      >
                        🚪 Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          navigate('/doctor-login')
                          setIsDoctorDropdownOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 font-medium"
                      >
                        🔑 Login
                      </button>
                      <button
                        onClick={() => {
                          navigate('/doctor-register')
                          setIsDoctorDropdownOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-cyan-50 text-gray-700 font-medium border-t"
                      >
                        ✍️ Register
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Admin Button */}
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="hidden sm:block text-orange-600 font-semibold px-4 py-2 rounded-lg hover:bg-orange-50 transition-all text-sm"
            >
              🔐 Admin
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 space-y-2">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
            
            <button
              onClick={() => {
                navigate('/book-appointment')
                setIsMenuOpen(false)
              }}
              className="w-full text-left px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold rounded-lg hover:shadow-lg transition-all mt-4"
            >
              📅 Book Appointment
            </button>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              {doctorToken ? (
                <>
                  <button
                    onClick={() => {
                      handleDoctorAdminAccess()
                      setIsMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 font-medium hover:bg-blue-50 rounded-lg"
                  >
                    👨‍💼 Doctor Dashboard
                  </button>
                  <button
                    onClick={() => {
                      handleLogoutDoctor()
                      setIsMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 font-medium hover:bg-red-50 rounded-lg"
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate('/doctor-login')
                      setIsMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 font-medium hover:bg-blue-50 rounded-lg"
                  >
                    🔑 Doctor Login
                  </button>
                  <button
                    onClick={() => {
                      navigate('/doctor-register')
                      setIsMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 font-medium hover:bg-cyan-50 rounded-lg"
                  >
                    ✍️ Register Doctor
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  navigate('/admin-dashboard')
                  setIsMenuOpen(false)
                }}
                className="w-full text-left px-4 py-2 text-orange-600 font-medium hover:bg-orange-50 rounded-lg"
              >
                🔐 Admin Panel
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
