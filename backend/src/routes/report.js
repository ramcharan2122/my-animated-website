import express from 'express';
import { dbQuery, dbGet } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get Latest Executive Report
router.get('/latest', authenticateToken, async (req, res) => {
  try {
    const latestSim = await dbGet(
      'SELECT id FROM simulations WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [req.user.id]
    );

    if (!latestSim) {
      return res.status(404).json({ error: 'No boardroom simulations found for user.' });
    }

    const sim = await dbGet('SELECT * FROM simulations WHERE id = ?', [latestSim.id]);
    const decisions = await dbQuery('SELECT * FROM agent_decisions WHERE simulation_id = ?', [latestSim.id]);
    const rawReport = await dbGet('SELECT * FROM reports WHERE simulation_id = ?', [latestSim.id]);

    let report = null;
    if (rawReport) {
      report = {
        ...rawReport,
        budget_breakdown: JSON.parse(rawReport.budget_breakdown_json || '[]'),
        department_highlights: JSON.parse(rawReport.department_highlights_json || '[]'),
        milestones: JSON.parse(rawReport.milestones_json || '[]')
      };
    }

    res.json({
      simulation: sim,
      agent_decisions: decisions,
      report
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch executive report.' });
  }
});

// Get Report By Simulation ID
router.get('/:simulationId', authenticateToken, async (req, res) => {
  try {
    const { simulationId } = req.params;
    const sim = await dbGet('SELECT * FROM simulations WHERE id = ?', [simulationId]);
    if (!sim) {
      return res.status(404).json({ error: 'Simulation report not found.' });
    }

    const decisions = await dbQuery('SELECT * FROM agent_decisions WHERE simulation_id = ?', [simulationId]);
    const rawReport = await dbGet('SELECT * FROM reports WHERE simulation_id = ?', [simulationId]);

    let report = null;
    if (rawReport) {
      report = {
        ...rawReport,
        budget_breakdown: JSON.parse(rawReport.budget_breakdown_json || '[]'),
        department_highlights: JSON.parse(rawReport.department_highlights_json || '[]'),
        milestones: JSON.parse(rawReport.milestones_json || '[]')
      };
    }

    res.json({
      simulation: sim,
      agent_decisions: decisions,
      report
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch executive report.' });
  }
});

export default router;
