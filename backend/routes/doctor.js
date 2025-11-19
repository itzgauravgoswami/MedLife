const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Blog = require('../models/Blog');
const { authDoctorMiddleware } = require('../middleware/auth');

// Doctor Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, specialty, experience, qualifications, phoneNumber, clinicName, clinicAddress, consultationFee, registrationNumber } = req.body;

    // Check if doctor already exists
    let doctor = await Doctor.findOne({ email });
    if (doctor) {
      return res.status(400).json({ message: 'Doctor already exists' });
    }

    // Create new doctor
    doctor = new Doctor({
      name,
      email,
      password,
      specialty,
      experience,
      qualifications,
      phoneNumber,
      clinicName,
      clinicAddress,
      consultationFee,
      registrationNumber,
      isVerified: false
    });

    await doctor.save();

    res.status(201).json({
      message: 'Doctor registered successfully. Waiting for admin verification.',
      doctorId: doctor._id
    });
  } catch (err) {
    res.status(500).json({ message: 'Error registering doctor', error: err.message });
  }
});

// Doctor Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await doctor.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!doctor.isVerified) {
      return res.status(403).json({ message: 'Doctor not verified yet. Please wait for admin approval.' });
    }

    const token = jwt.sign(
      { id: doctor._id, email: doctor.email, role: 'doctor' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

// Get Doctor Profile
router.get('/profile', authDoctorMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctorId).select('-password');
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

// Update Doctor Profile
router.put('/profile', authDoctorMiddleware, async (req, res) => {
  try {
    const { name, phoneNumber, clinicAddress, consultationFee, bio } = req.body;
    
    const doctor = await Doctor.findByIdAndUpdate(
      req.doctorId,
      { name, phoneNumber, clinicAddress, consultationFee, bio },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated', doctor });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
});

// Get Doctor Appointments
router.get('/appointments', authDoctorMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.doctorId }).populate('doctorId', 'name specialty');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching appointments', error: err.message });
  }
});

// Update Appointment Status
router.put('/appointments/:appointmentId', authDoctorMiddleware, async (req, res) => {
  try {
    const { status, notes } = req.body;

    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.doctorId.toString() !== req.doctorId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    appointment.status = status;
    if (notes) appointment.notes = notes;
    
    await appointment.save();

    res.json({ message: 'Appointment updated', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Error updating appointment', error: err.message });
  }
});

// Post Blog
router.post('/blogs', authDoctorMiddleware, async (req, res) => {
  try {
    const { title, excerpt, content, category } = req.body;

    const doctor = await Doctor.findById(req.doctorId);
    if (!doctor.isVerified) {
      return res.status(403).json({ message: 'Only verified doctors can post blogs' });
    }

    const blog = new Blog({
      title,
      excerpt,
      content,
      category,
      author: doctor.name,
      authorId: req.doctorId,
      authorType: 'doctor',
      isVerified: true // Doctor blogs auto-verified
    });

    await blog.save();

    res.status(201).json({ message: 'Blog posted successfully', blog });
  } catch (err) {
    res.status(500).json({ message: 'Error posting blog', error: err.message });
  }
});

// Get Doctor Blogs
router.get('/blogs', authDoctorMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find({ authorId: req.doctorId });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blogs', error: err.message });
  }
});

module.exports = router;
