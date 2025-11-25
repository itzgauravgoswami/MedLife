const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Blog = require('../models/Blog');
const Doctor = require('../models/Doctor');
const Medicine = require('../models/Medicine');

// Book Appointment (Public)
router.post('/appointments', async (req, res) => {
  try {
    console.log('Appointment request received:', req.body);
    
    const { patientName, patientEmail, patientPhone, patientAge, symptoms, doctorId, appointmentDate, consultationType } = req.body;

    if (!doctorId) {
      console.log('Error: Doctor selection required');
      return res.status(400).json({ message: 'Doctor selection required' });
    }

    console.log('Checking doctor:', doctorId);
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      console.log('Error: Doctor not found');
      return res.status(400).json({ message: 'Doctor not found' });
    }
    
    if (!doctor.isVerified) {
      console.log('Error: Doctor not verified');
      return res.status(400).json({ message: 'Doctor not verified' });
    }

    const appointment = new Appointment({
      patientName,
      patientEmail,
      patientPhone,
      patientAge,
      symptoms,
      doctorId,
      appointmentDate,
      consultationType,
      status: 'pending'
    });

    console.log('Saving appointment...');
    await appointment.save();
    console.log('Appointment saved successfully');

    res.status(201).json({
      message: 'Appointment booked successfully. Doctor will confirm shortly.',
      appointment
    });
  } catch (err) {
    console.error('Error booking appointment:', err);
    res.status(500).json({ 
      message: 'Error booking appointment', 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Get Verified Doctors (Public)
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find({ isVerified: true }).select('-password');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching doctors', error: err.message });
  }
});

// Get All Verified Blogs (Public)
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({ isVerified: true }).populate('authorId', 'name specialty');
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blogs', error: err.message });
  }
});

// Get Medicines (Public)
router.get('/medicines', async (req, res) => {
  try {
    const medicines = await Medicine.find({ stock: { $gt: 0 } });
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching medicines', error: err.message });
  }
});

module.exports = router;
