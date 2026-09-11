import { Router } from 'express';
import { db } from '../services/db.js';
import { verifyToken, optionalToken } from '../middleware/authMiddleware.js';

const router = Router();

// GET /api/match/practitioners - List master practitioners (Gurus)
router.get('/practitioners', (req, res) => {
  const practitioners = db.getCollection('practitioners');
  return res.json({ success: true, count: practitioners.length, practitioners });
});

// GET /api/match/learners - List enrolled learners (Shishyas)
router.get('/learners', (req, res) => {
  const learners = db.getCollection('learners');
  return res.json({ success: true, count: learners.length, learners });
});

// GET /api/match/applications - List active applications with optional filters
router.get('/applications', optionalToken, (req, res) => {
  const { learnerId, practitionerId, status } = req.query;
  let applications = db.getCollection('applications');

  if (learnerId) {
    applications = applications.filter(a => a.learnerId === learnerId || a.learnerName?.toLowerCase() === learnerId.toLowerCase());
  }
  if (practitionerId) {
    applications = applications.filter(a => a.practitionerId === practitionerId || a.practitionerName?.toLowerCase() === practitionerId.toLowerCase());
  }
  if (status) {
    applications = applications.filter(a => a.status === status);
  }

  return res.json({ success: true, count: applications.length, applications });
});

// POST /api/match/apply - Shishya chooses Guru and sends request + initial message (Requires JWT Auth)
router.post('/apply', verifyToken, (req, res) => {
  try {
    const { 
      learnerId, 
      learnerName, 
      practitionerId, 
      practitionerName, 
      tradition, 
      note 
    } = req.body;

    if (!learnerName || !practitionerName) {
      return res.status(400).json({ error: 'Learner name and Practitioner name are required.' });
    }

    const initialMessage = note?.trim() ? [{
      id: `msg-${Date.now()}`,
      sender: learnerName,
      senderRole: 'LEARNER',
      text: note.trim(),
      timestamp: new Date().toISOString()
    }] : [];

    const application = db.create('applications', {
      learnerId: learnerId || `learner-${Date.now()}`,
      learnerName,
      practitionerId: practitionerId || 'mp-1',
      practitionerName,
      tradition: tradition || 'Shahiri Powada',
      note: note || '',
      status: 'PENDING',
      messages: initialMessage,
      submittedAt: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: 'Apprenticeship application submitted to Guru successfully',
      application
    });
  } catch (err) {
    console.error('Error in /api/match/apply:', err);
    return res.status(500).json({ error: 'Failed to submit application' });
  }
});

// PUT /api/match/requests/:id/respond - Guru accepts/rejects Shishya (Requires JWT Auth)
router.put('/requests/:id/respond', verifyToken, (req, res) => {
  try {
    const { status } = req.body; // 'ACCEPTED' | 'REJECTED'
    if (!status || !['ACCEPTED', 'REJECTED', 'PENDING'].includes(status)) {
      return res.status(400).json({ error: 'Valid status required (ACCEPTED, REJECTED, PENDING).' });
    }

    const updated = db.update('applications', req.params.id, {
      status,
      respondedAt: new Date().toISOString()
    });

    if (!updated) {
      return res.json({
        success: true,
        message: `Request status updated to ${status}`,
        application: { id: req.params.id, status }
      });
    }

    return res.json({
      success: true,
      message: `Apprentice request ${status.toLowerCase()} successfully`,
      application: updated
    });
  } catch (err) {
    console.error('Error responding to request:', err);
    return res.status(500).json({ error: 'Failed to update request' });
  }
});

// GET /api/match/applications/:id/messages - Get chat messages for an application
router.get('/applications/:id/messages', optionalToken, (req, res) => {
  const app = db.getById('applications', req.params.id);
  if (!app) {
    return res.status(404).json({ error: 'Application not found' });
  }
  return res.json({
    success: true,
    status: app.status,
    messages: app.messages || []
  });
});

// POST /api/match/applications/:id/messages - Send a chat message (Requires JWT Auth)
router.post('/applications/:id/messages', verifyToken, (req, res) => {
  try {
    const app = db.getById('applications', req.params.id);
    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (app.status !== 'ACCEPTED') {
      return res.status(403).json({ 
        error: 'Chat is locked until Guru approves the apprenticeship request.' 
      });
    }

    const { sender, senderRole, text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Message text cannot be empty.' });
    }

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: sender || req.user?.name || 'User',
      senderRole: senderRole || req.user?.role || 'LEARNER',
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    const currentMsgs = app.messages || [];
    currentMsgs.push(newMsg);

    const updated = db.update('applications', req.params.id, {
      messages: currentMsgs,
      lastMessageAt: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      chatMessage: newMsg,
      application: updated
    });
  } catch (err) {
    console.error('Error sending message:', err);
    return res.status(500).json({ error: 'Failed to send message' });
  }
});

// POST /api/match/applications/:id/sessions - Schedule/Start a new learning session (Requires JWT Auth)
router.post('/applications/:id/sessions', verifyToken, (req, res) => {
  try {
    const app = db.getById('applications', req.params.id);
    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const { title, date, time, mode, notes } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Session title is required.' });
    }

    const newSession = {
      id: `ses-${Date.now()}`,
      title: title.trim(),
      date: date || new Date().toISOString().split('T')[0],
      time: time || '10:00 AM',
      mode: mode || 'Gurukul Offline Residency',
      notes: notes || '',
      status: 'SCHEDULED',
      createdAt: new Date().toISOString()
    };

    const sessions = app.sessions || [];
    sessions.push(newSession);

    // Also add automated message to chat history
    const systemMsg = {
      id: `msg-sys-${Date.now()}`,
      sender: 'Sanskriti System',
      senderRole: 'SYSTEM',
      text: `📅 New Gurukul Learning Session Scheduled: "${newSession.title}" on ${newSession.date} at ${newSession.time} (${newSession.mode}).`,
      timestamp: new Date().toISOString()
    };

    const messages = app.messages || [];
    messages.push(systemMsg);

    const updated = db.update('applications', req.params.id, {
      sessions,
      messages,
      lastSessionAt: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: 'Learning session scheduled successfully',
      session: newSession,
      application: updated
    });
  } catch (err) {
    console.error('Error creating session:', err);
    return res.status(500).json({ error: 'Failed to create session' });
  }
});

// PUT /api/match/applications/:id/sessions/:sessionId - Update session status
router.put('/applications/:id/sessions/:sessionId', (req, res) => {
  try {
    const app = db.getById('applications', req.params.id);
    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const { status } = req.body; // 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED'
    const sessions = app.sessions || [];
    const session = sessions.find(s => s.id === req.params.sessionId);

    if (session) {
      session.status = status;
      session.updatedAt = new Date().toISOString();
    }

    const updated = db.update('applications', req.params.id, { sessions });

    return res.json({
      success: true,
      message: `Session status updated to ${status}`,
      application: updated
    });
  } catch (err) {
    console.error('Error updating session status:', err);
    return res.status(500).json({ error: 'Failed to update session' });
  }
});

export default router;
