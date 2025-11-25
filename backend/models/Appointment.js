const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  patientName: {
    type: String,
    required: true
  },
  patientEmail: {
    type: String,
    required: true
  },
  patientPhone: {
    type: String,
    required: true
  },
  patientAge: {
    type: Number,
    required: true
  },
  symptoms: {
    type: String,
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
    default: 'pending'
  },
  consultationType: {
    type: String,
    enum: ['video', 'phone', 'in-person'],
    default: 'video'
  },
  notes: {
    type: String
  },
  doctorNotes: {
    type: String
  },
  prescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  },
  reports: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalReport'
  }],
  videoSessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VideoSession'
  },
  fee: {
    type: Number
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paymentId: {
    type: String
  },
  rejectionReason: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
