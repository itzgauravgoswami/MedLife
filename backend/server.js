require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// CORS - Allow all origins
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware to ensure DB connection for API routes
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('❌ Failed to connect to database:', err.message);
    res.status(503).json({
      success: false,
      message: 'Database connection unavailable',
      error: err.message
    });
  }
});

// Health check endpoints
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MedLife Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({ 
    status: 'OK', 
    message: 'Backend is running',
    mongodb: {
      state: dbStates[mongoose.connection.readyState] || 'unknown',
      readyState: mongoose.connection.readyState
    },
    environment: {
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV || 'development',
      isVercel: !!process.env.VERCEL
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/debug/models', (req, res) => {
  try {
    const models = mongoose.modelNames();
    res.json({
      success: true,
      models,
      count: models.length,
      connection: {
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// MongoDB Connection with caching for serverless
let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('📍 Using existing MongoDB connection');
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.error('⚠️  MONGODB_URI not set in environment variables');
    throw new Error('MONGODB_URI not configured');
  }

  try {
    mongoose.set('strictQuery', false);
    
    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
    };

    if (mongoose.connection.readyState === 0) {
      console.log('🔌 Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI, options);
      console.log('✅ MongoDB Connected Successfully');
      isConnected = true;
      
      // Initialize admin only once
      if (!global.adminInitialized) {
        await initializeAdmin();
        global.adminInitialized = true;
      }
    } else {
      console.log('📍 MongoDB already connecting/connected');
      isConnected = true;
    }
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    isConnected = false;
    throw err;
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
  isConnected = true;
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose disconnected from MongoDB');
  isConnected = false;
});

// Initial connection attempt
connectDB().catch(err => console.error('Initial connection failed:', err.message));

// Initialize admin account
async function initializeAdmin() {
  try {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.log('⚠️  Admin credentials not set');
      return;
    }
    
    const Admin = require('./models/Admin');
    const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!adminExists) {
      const admin = new Admin({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        name: 'Admin'
      });
      await admin.save();
      console.log('✅ Default admin created');
    } else {
      console.log('✅ Admin account exists');
    }
  } catch (err) {
    console.error('❌ Error initializing admin:', err.message);
  }
}

// Load routes with error handling
console.log('📦 Loading routes...');

try {
  const userRoutes = require('./routes/user');
  app.use('/api/user', userRoutes);
  console.log('✓ User routes loaded');
} catch (err) {
  console.error('✗ Error loading user routes:', err.message);
}

try {
  const doctorRoutes = require('./routes/doctor');
  app.use('/api/doctor', doctorRoutes);
  console.log('✓ Doctor routes loaded');
} catch (err) {
  console.error('✗ Error loading doctor routes:', err.message);
}

try {
  const adminRoutes = require('./routes/admin');
  app.use('/api/admin', adminRoutes);
  console.log('✓ Admin routes loaded');
} catch (err) {
  console.error('✗ Error loading admin routes:', err.message);
}

try {
  const deliveryRoutes = require('./routes/delivery');
  app.use('/api/delivery', deliveryRoutes);
  console.log('✓ Delivery routes loaded');
} catch (err) {
  console.error('✗ Error loading delivery routes:', err.message);
}

try {
  const publicRoutes = require('./routes/public');
  app.use('/api', publicRoutes);
  console.log('✓ Public routes loaded');
} catch (err) {
  console.error('✗ Error loading public routes:', err.message);
}

try {
  const orderRoutes = require('./routes/order');
  app.use('/api/order', orderRoutes);
  console.log('✓ Order routes loaded');
} catch (err) {
  console.error('✗ Error loading order routes:', err.message);
}

try {
  const paymentRoutes = require('./routes/payment');
  app.use('/api/payment', paymentRoutes);
  console.log('✓ Payment routes loaded');
} catch (err) {
  console.error('✗ Error loading payment routes:', err.message);
}

try {
  const reportsRoutes = require('./routes/reports');
  app.use('/api/reports', reportsRoutes);
  console.log('✓ Reports routes loaded');
} catch (err) {
  console.error('✗ Error loading reports routes:', err.message);
}

try {
  const prescriptionRoutes = require('./routes/prescription');
  app.use('/api/prescription', prescriptionRoutes);
  console.log('✓ Prescription routes loaded');
} catch (err) {
  console.error('✗ Error loading prescription routes:', err.message);
}

try {
  const telemedicineRoutes = require('./routes/telemedicine');
  app.use('/api/telemedicine', telemedicineRoutes);
  console.log('✓ Telemedicine routes loaded');
} catch (err) {
  console.error('✗ Error loading telemedicine routes:', err.message);
}

try {
  const medbotRoutes = require('./routes/medbot');
  app.use('/api/medbot', medbotRoutes);
  console.log('✓ Medbot routes loaded');
} catch (err) {
  console.error('✗ Error loading medbot routes:', err.message);
}

console.log('✅ All routes loaded');

// 404 handler
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.path);
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global error handler:', err.message);
  console.error(err.stack);
  
  res.status(err.status || 500).json({ 
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    path: req.path
  });
});

// Export for Vercel serverless
if (process.env.VERCEL) {
  console.log('🚀 Running on Vercel');
  module.exports = app;
} else {
  // Local development server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
