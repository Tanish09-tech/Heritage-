import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
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
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Socket.io Real-Time Engine Setup
const io = new Server(httpServer, {
  cors: {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.set('io', io);

// Middleware
app.use(cors({
  origin: true,
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
    security: 'JWT Token Middleware Enabled',
    realTime: 'Socket.io Engine Live',
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
    message: 'Welcome to Sanskriti Suraksha Backend API Server (PostgreSQL + JWT + Socket.io)',
    documentation: '/api/health'
  });
});

// Socket.io Connection & Event Handlers
io.on('connection', (socket) => {
  console.log(`⚡ [Socket.io] Client connected: ${socket.id}`);

  // Join a specific Guru-Shishya application chat room
  socket.on('join_room', (applicationId) => {
    socket.join(applicationId);
    console.log(`💬 [Socket.io] Socket ${socket.id} joined room: ${applicationId}`);
  });

  // Leave a chat room
  socket.on('leave_room', (applicationId) => {
    socket.leave(applicationId);
    console.log(`💬 [Socket.io] Socket ${socket.id} left room: ${applicationId}`);
  });

  // Broadcast real-time message to room
  socket.on('send_message', (data) => {
    const { applicationId, chatMessage } = data;
    console.log(`📩 [Socket.io] Message in room ${applicationId} from ${chatMessage?.sender}: ${chatMessage?.text}`);
    io.to(applicationId).emit('receive_message', chatMessage);
  });

  // Broadcast live typing indicators
  socket.on('typing_status', (data) => {
    const { applicationId, sender, isTyping } = data;
    socket.to(applicationId).emit('user_typing', { sender, isTyping });
  });

  socket.on('disconnect', () => {
    console.log(`🔌 [Socket.io] Client disconnected: ${socket.id}`);
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

// Initialize PostgreSQL & Start Express + Socket.io Server
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
  httpServer.listen(port, () => {
    console.log(`=======================================================`);
    console.log(`🏛️  Sanskriti Suraksha JWT & Socket.io Server is live!`);
    console.log(`📡 URL: http://localhost:${port}`);
    console.log(`🔑 Auth: JWT Token Security Middleware Enabled`);
    console.log(`⚡ Real-Time: Socket.io Engine Live`);
    console.log(`📁 Local Storage: http://localhost:${port}/uploads`);
    console.log(`🩺 Health: http://localhost:${port}/api/health`);
    console.log(`=======================================================`);
  });

  httpServer.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} is currently in use. Automatically trying port ${Number(port) + 1}...`);
      startServer(Number(port) + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

bootApp();
