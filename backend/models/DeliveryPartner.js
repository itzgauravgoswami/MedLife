const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const deliveryPartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['bike', 'scooter', 'car'],
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true
  },
  aadharNumber: {
    type: String,
    required: true
  },
  currentLocation: {
    latitude: Number,
    longitude: Number,
    lastUpdated: Date
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 4.5
  },
  totalDeliveries: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    default: 'delivery'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

deliveryPartnerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

deliveryPartnerSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
