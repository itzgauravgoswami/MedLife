const mongoose = require('mongoose');

const videoSessionSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  roomId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'active', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  startTime: Date,
  endTime: Date,
  duration: Number,
  chatHistory: [{
    senderId: mongoose.Schema.Types.ObjectId,
    senderType: String,
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  doctorNotes: String,
  aiSummary: String,
  recordingUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VideoSession', videoSessionSchema);
