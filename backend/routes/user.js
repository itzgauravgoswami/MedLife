const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const MedicalReport = require('../models/MedicalReport');
const Prescription = require('../models/Prescription');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const { authUserMiddleware } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, age, gender } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      phone,
      age,
      gender,
      role: 'patient'
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: 'patient' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: 'patient'
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: 'patient' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: 'patient'
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

router.get('/profile', authUserMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

router.put('/profile', authUserMiddleware, async (req, res) => {
  try {
    const { name, phone, age, gender, address, bloodGroup, emergencyContact, medicalHistory } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, age, gender, address, bloodGroup, emergencyContact, medicalHistory },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
});

router.get('/appointments', authUserMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.userId })
      .populate('doctorId', 'name specialty clinicName consultationFee')
      .sort({ appointmentDate: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching appointments', error: err.message });
  }
});

router.post('/appointments/:id/cancel', authUserMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Appointment cancelled', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Error cancelling appointment', error: err.message });
  }
});

router.get('/reports', authUserMiddleware, async (req, res) => {
  try {
    const reports = await MedicalReport.find({ userId: req.userId })
      .populate('doctorId', 'name specialty')
      .sort({ uploadDate: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reports', error: err.message });
  }
});

router.get('/prescriptions', authUserMiddleware, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ userId: req.userId })
      .populate('doctorId', 'name specialty')
      .sort({ prescriptionDate: -1 });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching prescriptions', error: err.message });
  }
});

router.get('/orders', authUserMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('deliveryPartnerId', 'name phone vehicleNumber')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
});

router.get('/notifications', authUserMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      recipientId: req.userId, 
      recipientType: 'user' 
    }).sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
});

router.put('/notifications/:id/read', authUserMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Error updating notification', error: err.message });
  }
});

module.exports = router;
