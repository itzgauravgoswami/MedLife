require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const Admin = require('./models/Admin');

const app = express();
const server = http.createServer(app);

// Socket.io setup (only works in non-serverless environments)
let io = null;
if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SOCKETIO === 'true') {
  const socketIo = require('socket.io');
  io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
}

const corsOptions = {
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.options('/', cors(corsOptions));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

async function initializeAdmin() {
  try {
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

initializeAdmin();

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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for Vercel
module.exports = app;
