import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import ProtectedRoute from './components/ProtectedRoute'
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
import UserLogin from './pages/UserLogin'
import UserRegister from './pages/UserRegister'
import AdminLogin from './pages/AdminLogin'
import DeliveryPartnerLogin from './pages/DeliveryPartnerLogin'
import DeliveryPartnerRegister from './pages/DeliveryPartnerRegister'
import PatientDashboard from './pages/PatientDashboard'
import DeliveryDashboard from './pages/DeliveryDashboard'
import Telemedicine from './pages/Telemedicine'
import UploadReport from './pages/UploadReport'
import AIHealthCoach from './pages/AIHealthCoach'
import SecondOpinionAI from './pages/SecondOpinionAI'
import Emergency from './pages/Emergency'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
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
            
            <Route path="/user-login" element={<UserLogin />} />
            <Route path="/user-register" element={<UserRegister />} />
            <Route path="/doctor-login" element={<DoctorLogin />} />
            <Route path="/doctor-register" element={<DoctorRegister />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/delivery-login" element={<DeliveryPartnerLogin />} />
            <Route path="/delivery-register" element={<DeliveryPartnerRegister />} />
            
            <Route path="/book-appointment" element={<BookAppointment />} />
            
            <Route path="/patient-dashboard" element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>} />
            <Route path="/upload-report" element={<ProtectedRoute allowedRoles={['patient']}><UploadReport /></ProtectedRoute>} />
            <Route path="/ai-health-coach" element={<ProtectedRoute allowedRoles={['patient']}><AIHealthCoach /></ProtectedRoute>} />
            <Route path="/second-opinion-ai" element={<ProtectedRoute allowedRoles={['patient']}><SecondOpinionAI /></ProtectedRoute>} />
            <Route path="/emergency" element={<ProtectedRoute allowedRoles={['patient']}><Emergency /></ProtectedRoute>} />
            
            <Route path="/doctor-admin" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorAdmin /></ProtectedRoute>} />
            
            <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            
            <Route path="/delivery-dashboard" element={<ProtectedRoute allowedRoles={['delivery']}><DeliveryDashboard /></ProtectedRoute>} />
            
            <Route path="/telemedicine/:appointmentId" element={<ProtectedRoute allowedRoles={['patient', 'doctor']}><Telemedicine /></ProtectedRoute>} />
          </Routes>
          <MedBotChat />
          <Footer />
        </SocketProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
