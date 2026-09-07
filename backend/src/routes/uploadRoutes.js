import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from '../services/postgresDb.js';

const router = Router();

// Ensure local uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage engine to save files locally on disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max file size
});

// POST /api/upload - Upload audio/video/image file locally
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const relativeUrl = `/uploads/${req.file.filename}`;
    const fullUrl = `http://localhost:${process.env.PORT || 5000}${relativeUrl}`;

    // Optionally record in PostgreSQL knowledge_vault table
    const { title, tradition, practitioner, type } = req.body;
    if (title) {
      const id = `kn-${Date.now()}`;
      await pool.query(`
        INSERT INTO knowledge_vault (id, title, tradition, practitioner, type, file_url, status)
        VALUES ($1, $2, $3, $4, $5, $6, 'Archived')
      `, [id, title, tradition || 'General', practitioner || 'Field Audio', type || req.file.mimetype, relativeUrl]);
    }

    return res.status(201).json({
      success: true,
      message: 'File uploaded and stored locally on disk successfully.',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        url: relativeUrl,
        fullUrl
      }
    });
  } catch (err) {
    console.error('Error in local file upload:', err);
    return res.status(500).json({ error: 'Internal server error while saving file locally.' });
  }
});

export default router;
