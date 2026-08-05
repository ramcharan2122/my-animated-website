import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

let appSettings = {
  geminiModel: 'gemini-1.5-flash',
  riskSensitivity: 'balanced',
  agentWeighting: {
    finance: 90,
    risk: 85,
    marketing: 95,
    operations: 90
  },
  hasCustomKey: !!process.env.GEMINI_API_KEY
};

// Get Settings
router.get('/', authenticateToken, (req, res) => {
  res.json({
    settings: {
      ...appSettings,
      hasCustomKey: !!process.env.GEMINI_API_KEY
    }
  });
});

// Update Settings
router.post('/', authenticateToken, (req, res) => {
  try {
    const { apiKey, geminiModel, riskSensitivity, agentWeighting } = req.body;

    if (apiKey !== undefined) {
      process.env.GEMINI_API_KEY = apiKey;
    }
    if (geminiModel) appSettings.geminiModel = geminiModel;
    if (riskSensitivity) appSettings.riskSensitivity = riskSensitivity;
    if (agentWeighting) appSettings.agentWeighting = agentWeighting;

    res.json({
      message: 'System configuration updated successfully.',
      settings: {
        ...appSettings,
        hasCustomKey: !!process.env.GEMINI_API_KEY
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings.' });
  }
});

export default router;
