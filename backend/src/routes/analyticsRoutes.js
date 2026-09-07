import { Router } from 'express';
import { db } from '../services/db.js';

const router = Router();

// GET /api/analytics/summary
router.get('/summary', (req, res) => {
  try {
    const traditions = db.getCollection('traditions');
    const practitioners = db.getCollection('practitioners');
    const learners = db.getCollection('learners');
    const vault = db.getCollection('knowledgeVault');
    const queue = db.getCollection('validationQueue');

    const total = traditions.length;
    const critical = traditions.filter(t => t.status === 'CRITICAL').length;
    const vulnerable = traditions.filter(t => t.status === 'VULNERABLE').length;
    const strong = traditions.filter(t => t.status === 'STRONG').length;

    // State distribution across the 9 focus states
    const stateCounts = {};
    traditions.forEach(t => {
      const st = t.state || 'Other';
      stateCounts[st] = (stateCounts[st] || 0) + 1;
    });

    // Category distribution
    const categoryCounts = {};
    traditions.forEach(t => {
      const cat = t.category || 'Other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    return res.json({
      success: true,
      stats: {
        totalTraditions: total,
        criticalCount: critical,
        vulnerableCount: vulnerable,
        strongCount: strong,
        activeMastersCount: practitioners.length,
        activeLearnersCount: learners.length,
        vaultItemsCount: vault.length,
        pendingValidationCount: queue.filter(q => q.status === 'PENDING_REVIEW').length
      },
      stateDistribution: stateCounts,
      categoryDistribution: categoryCounts
    });
  } catch (err) {
    console.error('Error generating analytics:', err);
    return res.status(500).json({ error: 'Failed to generate analytics' });
  }
});

export default router;
