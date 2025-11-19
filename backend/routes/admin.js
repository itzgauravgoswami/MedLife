const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const Blog = require('../models/Blog');
const Medicine = require('../models/Medicine');
const Appointment = require('../models/Appointment');
const { authAdminMiddleware } = require('../middleware/auth');

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

// Get All Pending Doctors
router.get('/doctors/pending', authAdminMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({ isVerified: false }).select('-password');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching doctors', error: err.message });
  }
});

// Get All Verified Doctors
router.get('/doctors/verified', authAdminMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({ isVerified: true }).select('-password');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching doctors', error: err.message });
  }
});

// Verify Doctor
router.put('/doctors/:doctorId/verify', authAdminMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.doctorId,
      { isVerified: true },
      { new: true }
    ).select('-password');

    res.json({ message: 'Doctor verified successfully', doctor });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying doctor', error: err.message });
  }
});

// Reject/Remove Doctor
router.delete('/doctors/:doctorId', authAdminMiddleware, async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.doctorId);
    res.json({ message: 'Doctor removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing doctor', error: err.message });
  }
});

// Add Medicine
router.post('/medicines', authAdminMiddleware, async (req, res) => {
  try {
    const { name, category, type, price, description, stock, dosage, manufacturer, expiryDate } = req.body;

    const medicine = new Medicine({
      name,
      category,
      type,
      price,
      description,
      stock,
      dosage,
      manufacturer,
      expiryDate
    });

    await medicine.save();

    res.status(201).json({ message: 'Medicine added successfully', medicine });
  } catch (err) {
    res.status(500).json({ message: 'Error adding medicine', error: err.message });
  }
});

// Get All Medicines
router.get('/medicines', authAdminMiddleware, async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching medicines', error: err.message });
  }
});

// Update Medicine
router.put('/medicines/:medicineId', authAdminMiddleware, async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.medicineId,
      req.body,
      { new: true }
    );

    res.json({ message: 'Medicine updated successfully', medicine });
  } catch (err) {
    res.status(500).json({ message: 'Error updating medicine', error: err.message });
  }
});

// Delete Medicine
router.delete('/medicines/:medicineId', authAdminMiddleware, async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.medicineId);
    res.json({ message: 'Medicine deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting medicine', error: err.message });
  }
});

// Post Blog (Admin)
router.post('/blogs', authAdminMiddleware, async (req, res) => {
  try {
    const { title, excerpt, content, category } = req.body;

    const blog = new Blog({
      title,
      excerpt,
      content,
      category,
      author: 'Admin',
      authorType: 'admin',
      isVerified: true
    });

    await blog.save();

    res.status(201).json({ message: 'Blog posted successfully', blog });
  } catch (err) {
    res.status(500).json({ message: 'Error posting blog', error: err.message });
  }
});

// Get All Blogs (for admin management)
router.get('/blogs', authAdminMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find().populate('authorId', 'name');
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blogs', error: err.message });
  }
});

// Delete Blog
router.delete('/blogs/:blogId', authAdminMiddleware, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.blogId);
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting blog', error: err.message });
  }
});

// Get All Appointments (admin view)
router.get('/appointments', authAdminMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('doctorId', 'name specialty');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching appointments', error: err.message });
  }
});

// Update Appointment (admin)
router.put('/appointments/:appointmentId', authAdminMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.appointmentId,
      req.body,
      { new: true }
    ).populate('doctorId', 'name specialty');

    res.json({ message: 'Appointment updated', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Error updating appointment', error: err.message });
  }
});

module.exports = router;
