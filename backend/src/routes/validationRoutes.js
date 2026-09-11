import { Router } from 'express';
import { db } from '../services/db.js';
import { requireRole } from '../middleware/rbac.js';
import { verifyToken, optionalToken } from '../middleware/authMiddleware.js';
import pool from '../services/postgresDb.js';

const router = Router();

// GET /api/validation - List all validation queue items
router.get('/', optionalToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM validation_queue ORDER BY created_at DESC');
    if (result.rows.length > 0) {
      return res.json({ success: true, count: result.rows.length, queue: result.rows });
    }
  } catch (err) {
    // Fallback
  }
  const queue = db.getCollection('validationQueue');
  return res.json({ success: true, count: queue.length, queue });
});

// POST /api/validation - Add crowdsourced validation item (Requires JWT Auth)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { traditionName, submittedBy, field, dataSummary, evidence, state } = req.body;
    if (!traditionName || !submittedBy) {
      return res.status(400).json({ error: 'Tradition name and Submitter name are required.' });
    }

    const id = `val-${Date.now()}`;
    const detailsText = `${field || 'Field Records'}: ${dataSummary || 'Community evidence submitted.'}`;

    try {
      await pool.query(`
        INSERT INTO validation_queue (id, item_name, submitted_by, type, state, details, status)
        VALUES ($1, $2, $3, $4, $5, $6, 'PENDING')
      `, [id, traditionName, submittedBy, field || 'Field Documentation', state || 'Maharashtra', detailsText]);
    } catch (e) {
      console.warn('PostgreSQL insert validation warning:', e.message);
    }

    const newItem = db.create('validationQueue', {
      id,
      traditionName,
      submittedBy,
      date: new Date().toISOString().split('T')[0],
      status: 'PENDING_REVIEW',
      field: field || 'Field Documentation',
      dataSummary: dataSummary || 'Community field record submitted for validation.',
      confidence: 'Medium (Awaiting Community Review)',
      evidence: evidence || 'Crowdsourced cultural notes'
    });

    return res.status(201).json({
      success: true,
      message: 'Item added to community validation queue',
      item: newItem
    });
  } catch (err) {
    console.error('Error adding validation item:', err);
    return res.status(500).json({ error: 'Failed to add validation item' });
  }
});

// PUT /api/validation/:id/verify - Approve item (Requires JWT Auth & AUTHORITY role)
router.put('/:id/verify', verifyToken, requireRole(['AUTHORITY']), async (req, res) => {
  try {
    try {
      await pool.query(`
        UPDATE validation_queue SET status = 'COMMUNITY_VALIDATED' WHERE id = $1
      `, [req.params.id]);
    } catch (e) {}

    const updated = db.update('validationQueue', req.params.id, {
      status: 'COMMUNITY_VALIDATED',
      validatedAt: new Date().toISOString()
    });

    if (!updated) {
      return res.status(404).json({ error: 'Validation item not found' });
    }

    return res.json({
      success: true,
      message: 'Item verified and approved by authority',
      item: updated
    });
  } catch (err) {
    console.error('Error verifying validation item:', err);
    return res.status(500).json({ error: 'Failed to verify validation item' });
  }
});

export default router;
