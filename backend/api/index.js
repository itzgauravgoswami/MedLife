require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Admin = require('../models/Admin');

// Initialize Express app
const app = express();

// Enhanced CORS Configuration for Vercel
const corsOptions = {
  origin: function(origin, callback) {
    // Always allow requests (Vercel serverless issue)
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-JSON-Response'],
  optionsSuccessStatus: 200,
  maxAge: 86400,
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// MongoDB Connection (only connect once)
let mongooseConnection = null;

const connectDB = async () => {
  if (mongooseConnection) {
    return mongooseConnection;
  }
  
  try {
    mongooseConnection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
    
    // Initialize admin
    const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      const admin = new Admin({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        name: 'Admin'
      });
      await admin.save();
      console.log('Default admin created');
    }
    
    return mongooseConnection;
  } catch (err) {
    console.log('MongoDB Error:', err.message);
    throw err;
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Connect to DB on first request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Routes
app.use('/api/doctor', require('../routes/doctor'));
app.use('/api/admin', require('../routes/admin'));
app.use('/api', require('../routes/public'));
app.use('/api', require('../routes/order'));
app.use('/api/medbot', require('../routes/medbot'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: err.message || 'Internal Server Error',
    cors: 'Enabled'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
