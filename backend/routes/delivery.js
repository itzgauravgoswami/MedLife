const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const DeliveryPartner = require('../models/DeliveryPartner');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const { authDeliveryMiddleware } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, vehicleType, vehicleNumber, licenseNumber, aadharNumber } = req.body;

    let partner = await DeliveryPartner.findOne({ email });
    if (partner) {
      return res.status(400).json({ message: 'Delivery partner already exists' });
    }

    partner = new DeliveryPartner({
      name,
      email,
      password,
      phone,
      vehicleType,
      vehicleNumber,
      licenseNumber,
      aadharNumber,
      role: 'delivery'
    });

    await partner.save();

    res.status(201).json({
      message: 'Delivery partner registered successfully. Waiting for admin verification.',
      partnerId: partner._id
    });
  } catch (err) {
    res.status(500).json({ message: 'Error registering delivery partner', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const partner = await DeliveryPartner.findOne({ email });
    if (!partner) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await partner.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!partner.isVerified) {
      return res.status(403).json({ message: 'Account not verified. Please wait for admin approval.' });
    }

    const token = jwt.sign(
      { id: partner._id, email: partner.email, role: 'delivery' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      partner: {
        id: partner._id,
        name: partner.name,
        email: partner.email,
        phone: partner.phone,
        role: 'delivery'
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

router.get('/profile', authDeliveryMiddleware, async (req, res) => {
  try {
    const partner = await DeliveryPartner.findById(req.deliveryId).select('-password');
    res.json(partner);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

router.put('/profile', authDeliveryMiddleware, async (req, res) => {
  try {
    const { name, phone, vehicleType, vehicleNumber } = req.body;
    
    const partner = await DeliveryPartner.findByIdAndUpdate(
      req.deliveryId,
      { name, phone, vehicleType, vehicleNumber },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated', partner });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
});

router.put('/location', authDeliveryMiddleware, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    const partner = await DeliveryPartner.findByIdAndUpdate(
      req.deliveryId,
      { 
        currentLocation: {
          latitude,
          longitude,
          lastUpdated: new Date()
        }
      },
      { new: true }
    ).select('-password');

    res.json({ message: 'Location updated', partner });
  } catch (err) {
    res.status(500).json({ message: 'Error updating location', error: err.message });
  }
});

router.put('/availability', authDeliveryMiddleware, async (req, res) => {
  try {
    const { isAvailable } = req.body;
    
    const partner = await DeliveryPartner.findByIdAndUpdate(
      req.deliveryId,
      { isAvailable },
      { new: true }
    ).select('-password');

    res.json({ message: 'Availability updated', partner });
  } catch (err) {
    res.status(500).json({ message: 'Error updating availability', error: err.message });
  }
});

router.get('/orders', authDeliveryMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ 
      deliveryPartnerId: req.deliveryId 
    })
    .populate('userId', 'name phone')
    .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
});

router.get('/orders/assigned', authDeliveryMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ 
      deliveryPartnerId: req.deliveryId,
      status: { $in: ['assigned', 'picked', 'out_for_delivery'] }
    })
    .populate('userId', 'name phone')
    .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching assigned orders', error: err.message });
  }
});

router.put('/orders/:orderId/status', authDeliveryMiddleware, async (req, res) => {
  try {
    const { status, latitude, longitude, note } = req.body;
    
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.deliveryPartnerId.toString() !== req.deliveryId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    order.status = status;
    order.trackingHistory.push({
      status,
      location: { latitude, longitude },
      timestamp: new Date(),
      note
    });

    if (status === 'delivered') {
      order.actualDelivery = new Date();
      
      const partner = await DeliveryPartner.findById(req.deliveryId);
      partner.totalDeliveries += 1;
      partner.isAvailable = true;
      await partner.save();
    }

    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Error updating order status', error: err.message });
  }
});

router.get('/notifications', authDeliveryMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      recipientId: req.deliveryId, 
      recipientType: 'delivery' 
    }).sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
});

module.exports = router;
