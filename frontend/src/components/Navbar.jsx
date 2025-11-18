import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Find Doctors', href: '/find-doctors' },
    { label: 'Medicines', href: '/medicines' },
    { label: 'About us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact us', href: '/contact' },
    { label: 'MedBot', href: '/medbot' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="px-8 py-3">
        <div className="flex justify-between items-center h-12">
          {/* Logo Section */}
          <div className="flex items-center gap-2 ml-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300">
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2V18M4 10H16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-lg font-bold text-blue-600">MedCare</span>
          </div>

          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 focus:outline-none z-50"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-blue-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-blue-600 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`w-6 h-0.5 bg-blue-600 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex items-center gap-10">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.href}
                className="text-gray-700 font-medium text-sm hover:text-blue-600 transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Book Appointment Button - Desktop Only */}
          <div className="hidden md:flex items-center gap-3">
            <button className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold px-8 py-2 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              Book an Appointment
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex gap-3 px-4 py-3">
              <button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Book an Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
