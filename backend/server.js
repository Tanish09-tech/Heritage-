import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './src/routes/authRoutes.js';
import traditionsRoutes from './src/routes/traditionsRoutes.js';
import matchmakingRoutes from './src/routes/matchmakingRoutes.js';
import validationRoutes from './src/routes/validationRoutes.js';
import vaultRoutes from './src/routes/vaultRoutes.js';
import analyticsRoutes from './src/routes/analyticsRoutes.js';
import uploadRoutes from './src/routes/uploadRoutes.js';
import geminiRoutes from './src/routes/geminiRoutes.js';

import { initializePostgresSchema, seedPostgresData } from './src/services/postgresDb.js';
import { PILOT_TRADITIONS } from './src/data/seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true, // Allow frontend dev server
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Static serving for local file uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sanskriti Suraksha Living Heritage API',
    database: 'PostgreSQL (kapil123)',
    localStorage: 'Local Disk (/uploads)',
    geminiAi: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/traditions', traditionsRoutes);
app.use('/api/match', matchmakingRoutes);
app.use('/api/validation', validationRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/gemini', geminiRoutes);

// Root fallback
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Sanskriti Suraksha Backend API Server (PostgreSQL + Local Storage)',
    documentation: '/api/health'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Initialize PostgreSQL & Start Express Server
async function bootApp() {
  try {
    console.log('🐘 Initializing PostgreSQL database & schemas...');
    await initializePostgresSchema();
    await seedPostgresData(PILOT_TRADITIONS);
    console.log('✅ PostgreSQL Database connected and seeded successfully.');
  } catch (err) {
    console.error('⚠️ PostgreSQL initialization warning:', err.message);
  }

  startServer(PORT);
}

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`=======================================================`);
    console.log(`🏛️  Sanskriti Suraksha PostgreSQL Backend API is live!`);
    console.log(`📡 URL: http://localhost:${port}`);
    console.log(`🐘 DB: PostgreSQL (User: postgres, Pass: kapil123)`);
    console.log(`📁 Local Storage: http://localhost:${port}/uploads`);
    console.log(`🩺 Health: http://localhost:${port}/api/health`);
    console.log(`=======================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} is currently in use. Automatically trying port ${Number(port) + 1}...`);
      startServer(Number(port) + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

bootApp();
