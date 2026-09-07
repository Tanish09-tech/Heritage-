import express from 'express';
import { generateGeminiImage } from '../services/geminiService.js';

const router = express.Router();

/**
 * POST /api/gemini/generate-image
 * Generates or fetches an authentic cultural image using Google Gemini API.
 */
router.post('/generate-image', async (req, res) => {
  try {
    const { traditionTitle, state, category, description } = req.body;

    if (!traditionTitle) {
      return res.status(400).json({ error: 'traditionTitle is required' });
    }

    const result = await generateGeminiImage({
      traditionTitle,
      state,
      category,
      description
    });

    res.json(result);
  } catch (err) {
    console.error('Gemini Route Error:', err);
    res.status(500).json({ error: 'Failed to generate image via Gemini', details: err.message });
  }
});

export default router;
