const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');

// Create Order (Public)
router.post('/orders', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, customerAddress, city, postalCode, medicines } = req.body;

    // Calculate total amount
    let totalAmount = 0;
    const medicineDetails = [];

    for (let item of medicines) {
      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine) {
        return res.status(404).json({ error: `Medicine ${item.medicineId} not found` });
      }
      if (medicine.stock < item.quantity) {
        return res.status(400).json({ error: `Not enough stock for ${medicine.name}` });
      }

      const itemTotal = medicine.price * item.quantity;
      totalAmount += itemTotal;

      medicineDetails.push({
        medicineId: medicine._id,
        medicineName: medicine.name,
        quantity: item.quantity,
        price: medicine.price,
        total: itemTotal
      });

      // Update medicine stock
      medicine.stock -= item.quantity;
      await medicine.save();
    }

    const order = new Order({
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      city,
      postalCode,
      medicines: medicineDetails,
      totalAmount
    });

    await order.save();
    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Orders (Admin only)
router.get('/admin/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Order Status (Admin only)
router.put('/admin/orders/:orderId', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status, notes, updatedAt: Date.now() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order updated successfully', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Order by ID
router.get('/orders/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('medicines.medicineId');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Order (Admin only)
router.delete('/admin/orders/:orderId', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
