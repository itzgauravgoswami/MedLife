const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Blog = require('../models/Blog');
const Doctor = require('../models/Doctor');
const Medicine = require('../models/Medicine');

// Book Appointment (Public)
router.post('/appointments', async (req, res) => {
  try {
    console.log('📝 Appointment request received');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const { patientName, patientEmail, patientPhone, patientAge, symptoms, doctorId, appointmentDate, consultationType } = req.body;

    // Validate required fields
    if (!patientName || !patientEmail || !patientPhone) {
      console.log('❌ Missing required patient information');
      return res.status(400).json({ 
        success: false,
        message: 'Missing required patient information' 
      });
    }

    if (!doctorId) {
      console.log('❌ Doctor selection required');
      return res.status(400).json({ 
        success: false,
        message: 'Doctor selection required' 
      });
    }

    console.log('🔍 Checking doctor:', doctorId);
    
    let doctor;
    try {
      doctor = await Doctor.findById(doctorId);
    } catch (dbErr) {
      console.error('❌ Database error finding doctor:', dbErr.message);
      return res.status(500).json({ 
        success: false,
        message: 'Database error',
        error: dbErr.message
      });
    }

    if (!doctor) {
      console.log('❌ Doctor not found');
      return res.status(404).json({ 
        success: false,
        message: 'Doctor not found' 
      });
    }
    
    if (!doctor.isVerified) {
      console.log('❌ Doctor not verified');
      return res.status(400).json({ 
        success: false,
        message: 'Doctor not verified' 
      });
    }

    console.log('✅ Doctor verified, creating appointment...');

    const appointment = new Appointment({
      patientName,
      patientEmail,
      patientPhone,
      patientAge: patientAge || 0,
      symptoms: symptoms || 'Not specified',
      doctorId,
      appointmentDate: appointmentDate || new Date(),
      consultationType: consultationType || 'video',
      status: 'pending'
    });

    console.log('💾 Saving appointment...');
    await appointment.save();
    console.log('✅ Appointment saved successfully');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully. Doctor will confirm shortly.',
      appointment
    });
  } catch (err) {
    console.error('❌ Error booking appointment:', err.message);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ 
      success: false,
      message: 'Error booking appointment', 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : 'Internal server error'
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
