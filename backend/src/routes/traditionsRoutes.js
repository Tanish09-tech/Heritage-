import { Router } from 'express';
import pool from '../services/postgresDb.js';
import { db } from '../services/db.js';

const router = Router();

// GET /api/traditions - Query traditions with filters from PostgreSQL
router.get('/', async (req, res) => {
  try {
    const { state, category, status, search } = req.query;

    let query = 'SELECT * FROM traditions WHERE 1=1';
    let params = [];
    let paramIndex = 1;

    if (state && state !== 'All') {
      query += ` AND LOWER(state) = LOWER($${paramIndex})`;
      params.push(state);
      paramIndex++;
    }

    if (category && category !== 'All') {
      query += ` AND LOWER(category) = LOWER($${paramIndex})`;
      params.push(category);
      paramIndex++;
    }

    if (status && status !== 'All') {
      query += ` AND UPPER(status) = UPPER($${paramIndex})`;
      params.push(status);
      paramIndex++;
    }

    if (search) {
      query += ` AND (LOWER(name) LIKE $${paramIndex} OR LOWER(description) LIKE $${paramIndex} OR LOWER(state) LIKE $${paramIndex})`;
      params.push(`%${search.toLowerCase()}%`);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    let traditions = result.rows;

    // Fallback to JSON db if PostgreSQL table is empty or still initializing
    if (traditions.length === 0 && !state && !category && !search) {
      traditions = db.getCollection('traditions');
    }

    return res.json({
      success: true,
      count: traditions.length,
      traditions
    });
  } catch (err) {
    console.error('Error fetching traditions from PostgreSQL:', err);
    // Fallback
    const traditions = db.getCollection('traditions');
    return res.json({ success: true, count: traditions.length, traditions });
  }
});

// GET /api/traditions/:id - Get single tradition dossier
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM traditions WHERE id = $1', [req.params.id]);
    if (result.rows.length > 0) {
      return res.json({ success: true, tradition: result.rows[0] });
    }
    
    // Fallback
    const tradition = db.getById('traditions', req.params.id);
    if (!tradition) {
      return res.status(404).json({ error: 'Tradition not found' });
    }
    return res.json({ success: true, tradition });
  } catch (err) {
    const tradition = db.getById('traditions', req.params.id);
    if (!tradition) {
      return res.status(404).json({ error: 'Tradition not found' });
    }
    return res.json({ success: true, tradition });
  }
});

import { requireRole } from '../middleware/rbac.js';

// POST /api/traditions - Register new living tradition into PostgreSQL (Requires AUTHORITY / Admin role ONLY)
router.post('/', requireRole(['AUTHORITY']), async (req, res) => {
  try {
    const body = req.body;
    if (!body.name || !body.state) {
      return res.status(400).json({ error: 'Name and State are mandatory fields.' });
    }

    const score = Number(body.vulnerabilityScore || body.score) || 60;
    let status = body.status;
    if (!status) {
      if (score < 50) status = 'Critical';
      else if (score < 70) status = 'Vulnerable';
      else status = 'Strong';
    }

    const id = body.id || `tradition-${Date.now()}`;

    const query = `
      INSERT INTO traditions (
        id, name, sanskrit_name, category, state, region, community, language,
        vulnerability_score, status, description, historical_origin, master_count,
        learner_count, transmission_frequency, hero_image
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *;
    `;

    const values = [
      id, body.name, body.sanskritName || null, body.category || 'Cultural Art',
      body.state, body.region || null, body.community || null, body.language || null,
      score, status, body.description || null, body.historicalOrigin || null,
      Number(body.masterCount) || 0, Number(body.learnerCount) || 0,
      body.transmissionFrequency || null, body.heroImage || null
    ];

    const result = await pool.query(query, values);
    const newTradition = result.rows[0];

    // Mirror in JSON file db
    db.create('traditions', newTradition);

    return res.status(201).json({
      success: true,
      message: 'Living tradition registered successfully in PostgreSQL database.',
      tradition: newTradition
    });
  } catch (err) {
    console.error('Error inserting tradition into PostgreSQL:', err);
    return res.status(500).json({ error: 'Failed to create tradition' });
  }
});

export default router;
