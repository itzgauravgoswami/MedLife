const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const DeliveryPartner = require('../models/DeliveryPartner');
const Notification = require('../models/Notification');
const { authUserMiddleware, authAdminMiddleware } = require('../middleware/auth');

router.post('/create', authUserMiddleware, async (req, res) => {
  try {
    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      customerAddress, 
      city, 
      postalCode, 
      deliveryLocation,
      medicines, 
      prescriptionId,
      paymentMethod,
      paymentId 
    } = req.body;

    let totalAmount = 0;
    const orderMedicines = [];

    for (const item of medicines) {
      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine) {
        return res.status(400).json({ message: `Medicine ${item.medicineName} not found` });
      }
      if (medicine.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${medicine.name}` });
      }

      const total = medicine.price * item.quantity;
      totalAmount += total;

      orderMedicines.push({
        medicineId: medicine._id,
        medicineName: medicine.name,
        quantity: item.quantity,
        price: medicine.price,
        total
      });

      medicine.stock -= item.quantity;
      await medicine.save();
    }

    const order = new Order({
      userId: req.userId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      city,
      postalCode,
      deliveryLocation,
      medicines: orderMedicines,
      prescriptionId,
      totalAmount,
      paymentMethod,
      paymentId,
      isPaid: paymentMethod === 'razorpay' ? true : false,
      status: 'pending',
      trackingHistory: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Order placed successfully'
      }]
    });

    await order.save();

    const notification = new Notification({
      recipientId: req.userId,
      recipientType: 'user',
      title: 'Order Placed',
      message: `Your order #${order._id.toString().slice(-6)} has been placed successfully`,
      type: 'order',
      relatedId: order._id
    });
    await notification.save();

    res.status(201).json({ 
      message: 'Order created successfully', 
      order,
      orderId: order._id
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
});

router.get('/user', authUserMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('deliveryPartnerId', 'name phone vehicleNumber')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
});

router.get('/:orderId', authUserMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('deliveryPartnerId', 'name phone vehicleNumber currentLocation');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order', error: err.message });
  }
});

router.get('/:orderId/track', authUserMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('deliveryPartnerId', 'name phone vehicleNumber currentLocation');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({
      orderId: order._id,
      status: order.status,
      trackingHistory: order.trackingHistory,
      deliveryPartner: order.deliveryPartnerId,
      estimatedDelivery: order.estimatedDelivery,
      actualDelivery: order.actualDelivery
    });
  } catch (err) {
    res.status(500).json({ message: 'Error tracking order', error: err.message });
  }
});

router.post('/:orderId/assign', authAdminMiddleware, async (req, res) => {
  try {
    const { deliveryPartnerId } = req.body;

    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const partner = await DeliveryPartner.findById(deliveryPartnerId);
    if (!partner || !partner.isVerified) {
      return res.status(400).json({ message: 'Invalid delivery partner' });
    }

    order.deliveryPartnerId = deliveryPartnerId;
    order.status = 'assigned';
    order.trackingHistory.push({
      status: 'assigned',
      timestamp: new Date(),
      note: `Assigned to delivery partner ${partner.name}`
    });

    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setHours(estimatedDeliveryDate.getHours() + 24);
    order.estimatedDelivery = estimatedDeliveryDate;

    await order.save();

    partner.isAvailable = false;
    await partner.save();

    const notification = new Notification({
      recipientId: deliveryPartnerId,
      recipientType: 'delivery',
      title: 'New Delivery Assigned',
      message: `You have been assigned order #${order._id.toString().slice(-6)}`,
      type: 'delivery',
      relatedId: order._id
    });
    await notification.save();

    res.json({ message: 'Delivery partner assigned', order });
  } catch (err) {
    res.status(500).json({ message: 'Error assigning delivery partner', error: err.message });
  }
});

router.post('/razorpay/verify', authUserMiddleware, async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentId = paymentId;
    order.isPaid = true;
    order.status = 'confirmed';
    order.trackingHistory.push({
      status: 'confirmed',
      timestamp: new Date(),
      note: 'Payment verified and order confirmed'
    });

    await order.save();

    res.json({ message: 'Payment verified', order });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying payment', error: err.message });
  }
});

module.exports = router;
