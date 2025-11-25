import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, userRole, user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Find Doctors', href: '/find-doctors' },
    { label: 'Medicines', href: '/medicines' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  const handleLogout = () => {
    logout()
    setIsUserDropdownOpen(false)
    navigate('/')
  }

  const getDashboardRoute = () => {
    switch (userRole) {
      case 'patient': return '/patient-dashboard'
      case 'doctor': return '/doctor-admin'
      case 'admin': return '/admin-dashboard'
      case 'delivery': return '/delivery-dashboard'
      default: return '/'
    }
  }

  const getUserLabel = () => {
    switch (userRole) {
      case 'patient': return 'My Dashboard'
      case 'doctor': return 'Doctor Portal'
      case 'admin': return 'Admin Panel'
      case 'delivery': return 'Deliveries'
      default: return 'Dashboard'
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
            {/* Book Appointment Button - only for patients/guests */}
            {(!isAuthenticated || userRole === 'patient') && (
              <button
                onClick={() => navigate('/book-appointment')}
                className="hidden sm:flex bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold px-6 py-2 rounded-lg hover:shadow-lg transition-all text-sm"
              >
                Book Appointment
              </button>
            )}

            {isAuthenticated ? (
              /* User Dropdown */
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <span>{user?.name || 'User'}</span>
                  <span className={`text-xs transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <button
                      onClick={() => {
                        navigate(getDashboardRoute())
                        setIsUserDropdownOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 font-medium"
                    >
                      📊 {getUserLabel()}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-gray-700 font-medium border-t"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Login Dropdown */
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
                >
                  🔐 Login
                  <span className={`text-xs transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <button
                      onClick={() => {
                        navigate('/user-login')
                        setIsUserDropdownOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 font-medium"
                    >
                      👤 Patient Login
                    </button>
                    <button
                      onClick={() => {
                        navigate('/doctor-login')
                        setIsUserDropdownOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-cyan-50 text-gray-700 font-medium"
                    >
                      👨‍⚕️ Doctor Login
                    </button>
                    <button
                      onClick={() => {
                        navigate('/admin-login')
                        setIsUserDropdownOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-orange-50 text-gray-700 font-medium"
                    >
                      🔐 Admin Login
                    </button>
                    <button
                      onClick={() => {
                        navigate('/delivery-login')
                        setIsUserDropdownOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-green-50 text-gray-700 font-medium"
                    >
                      🚚 Delivery Login
                    </button>
                  </div>
                )}
              </div>
            )}

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
            
            {(!isAuthenticated || userRole === 'patient') && (
              <button
                onClick={() => {
                  navigate('/book-appointment')
                  setIsMenuOpen(false)
                }}
                className="w-full text-left px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold rounded-lg hover:shadow-lg transition-all mt-4"
              >
                📅 Book Appointment
              </button>
            )}

            <div className="border-t border-gray-200 pt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      navigate(getDashboardRoute())
                      setIsMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 font-medium hover:bg-blue-50 rounded-lg"
                  >
                    📊 {getUserLabel()}
                  </button>
                  <button
                    onClick={() => {
                      handleLogout()
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
                      navigate('/user-login')
                      setIsMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 font-medium hover:bg-blue-50 rounded-lg"
                  >
                    👤 Patient Login
                  </button>
                  <button
                    onClick={() => {
                      navigate('/doctor-login')
                      setIsMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 font-medium hover:bg-cyan-50 rounded-lg"
                  >
                    👨‍⚕️ Doctor Login
                  </button>
                  <button
                    onClick={() => {
                      navigate('/admin-login')
                      setIsMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-orange-600 font-medium hover:bg-orange-50 rounded-lg"
                  >
                    🔐 Admin Login
                  </button>
                  <button
                    onClick={() => {
                      navigate('/delivery-login')
                      setIsMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-green-600 font-medium hover:bg-green-50 rounded-lg"
                  >
                    🚚 Delivery Login
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
