import { Router } from 'express';
import { db } from '../services/db.js';
import { verifyToken, optionalToken } from '../middleware/authMiddleware.js';

const router = Router();

// GET /api/vault - List all archived knowledge items
router.get('/', optionalToken, (req, res) => {
  const items = db.getCollection('knowledgeVault');
  return res.json({ success: true, count: items.length, items });
});

// POST /api/vault - Add knowledge item (Requires JWT Auth)
router.post('/', verifyToken, (req, res) => {
  try {
    const { title, tradition, practitioner, type, language, transcriptExcerpt, englishTranslation, tags } = req.body;
    if (!title || !tradition) {
      return res.status(400).json({ error: 'Title and Tradition are mandatory.' });
    }

    const newItem = db.create('knowledgeVault', {
      id: `kn-${Date.now()}`,
      title,
      tradition,
      practitioner: practitioner || 'Traditional Master',
      type: type || 'Audio Recording + Transcript',
      language: language || 'Regional Dialect',
      date: new Date().toISOString().split('T')[0],
      tags: tags || [tradition],
      consent: 'Verified Community Heritage Access',
      transcriptExcerpt: transcriptExcerpt || '',
      englishTranslation: englishTranslation || '',
      createdAt: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: 'Knowledge item deposited into Vault successfully',
      item: newItem
    });
  } catch (err) {
    console.error('Error adding vault item:', err);
    return res.status(500).json({ error: 'Failed to deposit knowledge item' });
  }
});

// DELETE /api/vault/:id - Delete knowledge item
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.delete('knowledgeVault', id);
    return res.json({ success: true, message: `Vault item ${id} deleted successfully` });
  } catch (err) {
    console.error('Error deleting vault item:', err);
    return res.status(500).json({ error: 'Failed to delete knowledge item' });
  }
});

export default router;
