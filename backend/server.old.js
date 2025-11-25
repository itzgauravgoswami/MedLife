require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Global error handlers to prevent crashes
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

const Admin = require('./models/Admin');

const app = express();

// Socket.io setup (only in local development)
let io = null;
let server = null;

// Only use Socket.io in local development (not on Vercel)
if (!process.env.VERCEL) {
  try {
    const http = require('http');
    server = http.createServer(app);
    try {
      const socketIo = require('socket.io');
      io = socketIo(server, {
        cors: {
          origin: '*',
          methods: ['GET', 'POST']
        }
      });
      console.log('Socket.io enabled for local development');
    } catch (socketErr) {
      console.log('Socket.io not available, continuing without websockets');
    }
  } catch (err) {
    console.log('HTTP server creation error:', err.message);
  }
} else {
  console.log('Running on Vercel - Socket.io disabled');
}

// Simplified CORS - allow everything for now
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'MedLife Backend API',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Backend is running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// MongoDB Connection - non-blocking
let dbConnected = false;
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  })
    .then(() => {
      console.log('MongoDB Connected');
      dbConnected = true;
      initializeAdmin();
    })
    .catch(err => {
      console.error('MongoDB Connection Error:', err.message);
    });
} else {
  console.error('MONGODB_URI not set in environment variables');
}

async function initializeAdmin() {
  try {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.log('Admin credentials not set in environment');
      return;
    }
    
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
  } catch (err) {
    console.log('Error creating admin:', err.message);
  }
}

// Routes with error handling
try {
  app.use('/api/user', require('./routes/user'));
  app.use('/api/doctor', require('./routes/doctor'));
  app.use('/api/admin', require('./routes/admin'));
  app.use('/api/delivery', require('./routes/delivery'));
  app.use('/api', require('./routes/public'));
  app.use('/api/order', require('./routes/order'));
  app.use('/api/payment', require('./routes/payment'));
  app.use('/api/reports', require('./routes/reports'));
  app.use('/api/prescription', require('./routes/prescription'));
  app.use('/api/telemedicine', require('./routes/telemedicine'));
  app.use('/api/medbot', require('./routes/medbot'));
  console.log('All routes loaded successfully');
} catch (routeErr) {
  console.error('Error loading routes:', routeErr.message);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Socket.io event handlers (only if socket.io is enabled)
if (io) {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId);
      socket.to(roomId).emit('user-connected', userId);
      console.log(`User ${userId} joined room ${roomId}`);
    });

    socket.on('offer', (roomId, offer) => {
      socket.to(roomId).emit('offer', offer);
    });

    socket.on('answer', (roomId, answer) => {
      socket.to(roomId).emit('answer', answer);
    });

    socket.on('ice-candidate', (roomId, candidate) => {
      socket.to(roomId).emit('ice-candidate', candidate);
    });

    socket.on('send-message', (roomId, message) => {
      io.to(roomId).emit('receive-message', message);
    });

    socket.on('location-update', (data) => {
      io.emit('delivery-location-update', data);
    });

    socket.on('order-status-update', (data) => {
      io.emit('order-status-changed', data);
    });

    socket.on('appointment-update', (data) => {
      io.emit('appointment-status-changed', data);
    });

    socket.on('leave-room', (roomId, userId) => {
      socket.to(roomId).emit('user-disconnected', userId);
      socket.leave(roomId);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  app.set('io', io);
}

// For Vercel serverless
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // For local development
  const PORT = process.env.PORT || 5000;
  if (server) {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} with Socket.io`);
    });
  } else {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} without Socket.io`);
    });
  }
}
