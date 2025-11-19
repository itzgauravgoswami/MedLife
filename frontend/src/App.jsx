import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MedBotChat from './components/MedBotChat'
import Home from './pages/Home'
import Services from './pages/Services'
import FindDoctors from './pages/FindDoctors'
import Medicines from './pages/Medicines'
import Cart from './pages/Cart'
import About from './pages/About'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import MedBot from './pages/MedBot'
import DoctorAdmin from './pages/DoctorAdmin'
import AdminDashboard from './pages/AdminDashboard'
import DoctorLogin from './pages/DoctorLogin'
import DoctorRegister from './pages/DoctorRegister'
import BookAppointment from './pages/BookAppointment'
import './App.css'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/find-doctors" element={<FindDoctors />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/medbot" element={<MedBot />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/doctor-register" element={<DoctorRegister />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/doctor-admin" element={<DoctorAdmin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
      <MedBotChat />
      <Footer />
    </Router>
  )
}

export default App
