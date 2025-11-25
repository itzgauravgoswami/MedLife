const express = require('express');
const router = express.Router();
const VideoSession = require('../models/VideoSession');
const Appointment = require('../models/Appointment');
const { authUserMiddleware, authDoctorMiddleware, authAnyMiddleware } = require('../middleware/auth');

router.post('/create', authDoctorMiddleware, async (req, res) => {
  try {
    const { appointmentId, userId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.doctorId.toString() !== req.doctorId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const roomId = `room_${Date.now()}`;

    const videoSession = new VideoSession({
      appointmentId,
      doctorId: req.doctorId,
      userId,
      sessionId,
      roomId,
      status: 'scheduled'
    });

    await videoSession.save();

    appointment.videoSessionId = videoSession._id;
    await appointment.save();

    res.status(201).json({ 
      message: 'Video session created', 
      videoSession,
      roomId,
      sessionId
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating video session', error: err.message });
  }
});

router.get('/appointment/:appointmentId', authAnyMiddleware, async (req, res) => {
  try {
    const videoSession = await VideoSession.findOne({ 
      appointmentId: req.params.appointmentId 
    })
    .populate('doctorId', 'name specialty')
    .populate('userId', 'name email');

    if (!videoSession) {
      return res.status(404).json({ message: 'Video session not found' });
    }

    res.json(videoSession);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching video session', error: err.message });
  }
});

router.get('/:sessionId', authAnyMiddleware, async (req, res) => {
  try {
    const videoSession = await VideoSession.findOne({ sessionId: req.params.sessionId })
      .populate('doctorId', 'name specialty')
      .populate('userId', 'name email');

    if (!videoSession) {
      return res.status(404).json({ message: 'Video session not found' });
    }

    res.json(videoSession);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching video session', error: err.message });
  }
});

router.put('/:sessionId/start', authAnyMiddleware, async (req, res) => {
  try {
    const videoSession = await VideoSession.findOne({ sessionId: req.params.sessionId });

    if (!videoSession) {
      return res.status(404).json({ message: 'Video session not found' });
    }

    videoSession.status = 'active';
    videoSession.startTime = new Date();
    await videoSession.save();

    res.json({ message: 'Video session started', videoSession });
  } catch (err) {
    res.status(500).json({ message: 'Error starting video session', error: err.message });
  }
});

router.put('/:sessionId/end', authAnyMiddleware, async (req, res) => {
  try {
    const { doctorNotes, aiSummary } = req.body;
    
    const videoSession = await VideoSession.findOne({ sessionId: req.params.sessionId });

    if (!videoSession) {
      return res.status(404).json({ message: 'Video session not found' });
    }

    videoSession.status = 'completed';
    videoSession.endTime = new Date();
    videoSession.duration = Math.floor((videoSession.endTime - videoSession.startTime) / 1000);
    
    if (doctorNotes) videoSession.doctorNotes = doctorNotes;
    if (aiSummary) videoSession.aiSummary = aiSummary;
    
    await videoSession.save();

    const appointment = await Appointment.findById(videoSession.appointmentId);
    if (appointment) {
      appointment.status = 'completed';
      await appointment.save();
    }

    res.json({ message: 'Video session ended', videoSession });
  } catch (err) {
    res.status(500).json({ message: 'Error ending video session', error: err.message });
  }
});

router.post('/:sessionId/chat', authAnyMiddleware, async (req, res) => {
  try {
    const { message, senderType } = req.body;
    
    const videoSession = await VideoSession.findOne({ sessionId: req.params.sessionId });

    if (!videoSession) {
      return res.status(404).json({ message: 'Video session not found' });
    }

    videoSession.chatHistory.push({
      senderId: req.userId,
      senderType,
      message,
      timestamp: new Date()
    });

    await videoSession.save();

    res.json({ message: 'Message sent', chat: videoSession.chatHistory });
  } catch (err) {
    res.status(500).json({ message: 'Error sending message', error: err.message });
  }
});

router.get('/:sessionId/chat', authAnyMiddleware, async (req, res) => {
  try {
    const videoSession = await VideoSession.findOne({ sessionId: req.params.sessionId });

    if (!videoSession) {
      return res.status(404).json({ message: 'Video session not found' });
    }

    res.json(videoSession.chatHistory);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching chat', error: err.message });
  }
});

module.exports = router;
