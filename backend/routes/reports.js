const express = require('express');
const router = express.Router();
const MedicalReport = require('../models/MedicalReport');
const { authUserMiddleware, authDoctorMiddleware, authAnyMiddleware } = require('../middleware/auth');

router.post('/upload', authUserMiddleware, async (req, res) => {
  try {
    const { title, description, reportType, fileUrl, fileType, testDate } = req.body;

    const report = new MedicalReport({
      userId: req.userId,
      title,
      description,
      reportType,
      fileUrl,
      fileType,
      testDate: testDate || Date.now()
    });

    await report.save();

    res.status(201).json({ message: 'Report uploaded successfully', report });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading report', error: err.message });
  }
});

router.get('/user', authUserMiddleware, async (req, res) => {
  try {
    const reports = await MedicalReport.find({ userId: req.userId })
      .populate('doctorId', 'name specialty')
      .sort({ uploadDate: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reports', error: err.message });
  }
});

router.get('/:reportId', authAnyMiddleware, async (req, res) => {
  try {
    const report = await MedicalReport.findById(req.params.reportId)
      .populate('userId', 'name email age gender')
      .populate('doctorId', 'name specialty');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (req.userRole === 'patient' && report.userId._id.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching report', error: err.message });
  }
});

router.post('/:reportId/share', authUserMiddleware, async (req, res) => {
  try {
    const { doctorId } = req.body;
    
    const report = await MedicalReport.findById(req.params.reportId);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (report.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    report.isSharedWithDoctor = true;
    report.sharedWith.push({
      doctorId,
      sharedAt: new Date()
    });

    await report.save();

    res.json({ message: 'Report shared successfully', report });
  } catch (err) {
    res.status(500).json({ message: 'Error sharing report', error: err.message });
  }
});

router.put('/:reportId/summary', authDoctorMiddleware, async (req, res) => {
  try {
    const { aiSummary, findings } = req.body;
    
    const report = await MedicalReport.findByIdAndUpdate(
      req.params.reportId,
      { aiSummary, findings },
      { new: true }
    );

    res.json({ message: 'Report summary updated', report });
  } catch (err) {
    res.status(500).json({ message: 'Error updating summary', error: err.message });
  }
});

router.delete('/:reportId', authUserMiddleware, async (req, res) => {
  try {
    const report = await MedicalReport.findById(req.params.reportId);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (report.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await MedicalReport.findByIdAndDelete(req.params.reportId);

    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting report', error: err.message });
  }
});

router.get('/patient/:userId', authDoctorMiddleware, async (req, res) => {
  try {
    const reports = await MedicalReport.find({ 
      userId: req.params.userId,
      $or: [
        { isSharedWithDoctor: true },
        { 'sharedWith.doctorId': req.doctorId }
      ]
    }).sort({ uploadDate: -1 });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching patient reports', error: err.message });
  }
});

module.exports = router;
