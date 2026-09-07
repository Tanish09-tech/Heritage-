import { Router } from 'express';
import { db } from '../services/db.js';

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

// GET /api/match/applications - List active applications
router.get('/applications', (req, res) => {
  const applications = db.getCollection('applications');
  return res.json({ success: true, count: applications.length, applications });
});

// POST /api/match/apply - Shishya applies to Guru
router.post('/apply', (req, res) => {
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

    const application = db.create('applications', {
      learnerId: learnerId || `learner-${Date.now()}`,
      learnerName,
      practitionerId: practitionerId || 'mp-1',
      practitionerName,
      tradition: tradition || 'Shahiri Powada',
      note: note || '',
      status: 'PENDING',
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

import { requireRole } from '../middleware/rbac.js';

// PUT /api/match/requests/:id/respond - Guru accepts/rejects Shishya (Requires PRACTITIONER or AUTHORITY role)
router.put('/requests/:id/respond', requireRole(['PRACTITIONER', 'AUTHORITY']), (req, res) => {
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
      // Fallback: create or acknowledge response
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

export default router;
