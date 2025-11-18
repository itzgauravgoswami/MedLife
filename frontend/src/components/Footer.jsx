import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="px-4 md:px-16 py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">MedCare</h3>
            <p className="text-gray-400 leading-relaxed">
              Your trusted partner in digital healthcare. Connecting patients with qualified doctors for better health outcomes.
            </p>
            <div className="flex gap-4 mt-6">
              <FaFacebook className="text-2xl hover:text-cyan-400 cursor-pointer transition" />
              <FaTwitter className="text-2xl hover:text-cyan-400 cursor-pointer transition" />
              <FaLinkedin className="text-2xl hover:text-cyan-400 cursor-pointer transition" />
              <FaInstagram className="text-2xl hover:text-cyan-400 cursor-pointer transition" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-cyan-400 transition">Home</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Services</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Find Doctors</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">About Us</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Services</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-cyan-400 transition">Consultations</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Prescriptions</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Lab Tests</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Health Records</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Contact Info</h4>
            <ul className="space-y-3">
              <li className="hover:text-cyan-400 transition">Email: support@medcare.com</li>
              <li className="hover:text-cyan-400 transition">Phone: +1 (800) 123-4567</li>
              <li className="hover:text-cyan-400 transition">Hours: 24/7</li>
              <li className="hover:text-cyan-400 transition">Address: 123 Health Ave, NY</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 MedCare. All rights reserved.</p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
