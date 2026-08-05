import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import simulationRoutes from './routes/simulation.js';
import reportRoutes from './routes/report.js';
import settingsRoutes from './routes/settings.js';
import campaignRoutes from './routes/campaign.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// CORS & Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'ShadowBoard Enterprise AI Engine',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/campaign', campaignRoutes);

// Static files for frontend production build
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Boardroom Engine Error',
    message: err.message || 'An unexpected error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`
  ╔═════════════════════════════════════════════════════════════════════╗
  ║    SHADOWBOARD ENTERPRISE AI - AUTONOMOUS EXECUTIVE BOARD ENGINE    ║
  ║    Server listening on http://localhost:${PORT}                       ║
  ║    Environment: ${process.env.NODE_ENV || 'development'}               ║
  ║    Gemini Status: ${process.env.GEMINI_API_KEY ? 'CONNECTED' : 'SYNTHETIC FALLBACK MODE'}    ║
  ╚═════════════════════════════════════════════════════════════════════╝
  `);
});
