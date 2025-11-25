const mongoose = require('mongoose');

const medicalReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  reportType: {
    type: String,
    enum: ['lab', 'radiology', 'prescription', 'diagnosis', 'other'],
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  testDate: {
    type: Date
  },
  aiSummary: {
    type: String
  },
  findings: [String],
  isSharedWithDoctor: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    sharedAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MedicalReport', medicalReportSchema);
