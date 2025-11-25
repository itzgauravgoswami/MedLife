const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const { authUserMiddleware, authDoctorMiddleware } = require('../middleware/auth');

router.post('/create', authDoctorMiddleware, async (req, res) => {
  try {
    const { userId, appointmentId, diagnosis, medicines, labTests, followUpDate, notes } = req.body;

    const prescription = new Prescription({
      userId,
      doctorId: req.doctorId,
      appointmentId,
      diagnosis,
      medicines,
      labTests,
      followUpDate,
      notes
    });

    await prescription.save();

    res.status(201).json({ message: 'Prescription created successfully', prescription });
  } catch (err) {
    res.status(500).json({ message: 'Error creating prescription', error: err.message });
  }
});

router.get('/user', authUserMiddleware, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ userId: req.userId, isActive: true })
      .populate('doctorId', 'name specialty clinicName')
      .sort({ prescriptionDate: -1 });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching prescriptions', error: err.message });
  }
});

router.get('/doctor', authDoctorMiddleware, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctorId: req.doctorId })
      .populate('userId', 'name email phone')
      .sort({ prescriptionDate: -1 });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching prescriptions', error: err.message });
  }
});

router.get('/:prescriptionId', authUserMiddleware, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.prescriptionId)
      .populate('userId', 'name email phone age')
      .populate('doctorId', 'name specialty clinicName');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    if (prescription.userId._id.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(prescription);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching prescription', error: err.message });
  }
});

router.post('/:prescriptionId/add-to-cart', authUserMiddleware, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.prescriptionId);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    if (prescription.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const cartItems = [];
    for (const med of prescription.medicines) {
      if (med.medicineId) {
        const medicine = await Medicine.findById(med.medicineId);
        if (medicine && medicine.stock > 0) {
          cartItems.push({
            medicineId: medicine._id,
            medicineName: medicine.name,
            quantity: 1,
            price: medicine.price,
            total: medicine.price
          });
        }
      }
    }

    prescription.addedToCart = true;
    await prescription.save();

    res.json({ 
      message: 'Medicines added to cart', 
      cartItems,
      prescriptionId: prescription._id
    });
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart', error: err.message });
  }
});

module.exports = router;
