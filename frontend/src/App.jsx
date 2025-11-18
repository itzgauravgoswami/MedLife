import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import FindDoctors from './pages/FindDoctors'
import Medicines from './pages/Medicines'
import About from './pages/About'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import MedBot from './pages/MedBot'
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
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/medbot" element={<MedBot />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
