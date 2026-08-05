import express from 'express';
import { randomUUID } from 'crypto';
import { dbQuery, dbGet, dbRun } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import { runBoardroomSimulation, AGENT_DEFINITIONS } from '../services/geminiService.js';

const router = express.Router();

// Run Simulation Endpoint
router.post('/run', authenticateToken, async (req, res) => {
  try {
    const { goal, budget, timeline, location, employees, marketingSpend, title } = req.body;

    if (!goal) {
      return res.status(400).json({ error: 'Business goal or objective is required.' });
    }

    const simId = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const simTitle = title || goal.length > 50 ? `${goal.substring(0, 47)}...` : goal;

    // Run Gemini Multi-Agent Simulation
    const result = await runBoardroomSimulation({ goal, budget, timeline, location, employees, marketingSpend });

    // Store Simulation Record
    await dbRun(
      `INSERT INTO simulations (id, user_id, title, goal, budget, timeline, location, employees, marketing_spend, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        simId,
        req.user.id,
        simTitle,
        goal,
        budget || '₹2 Crore',
        timeline || '6 Months',
        location || 'Bangalore',
        employees || 25,
        marketingSpend || '₹50 Lakhs',
        'COMPLETED'
      ]
    );

    // Store Agent Decisions
    for (const agentDec of result.agent_decisions) {
      const decId = `dec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const agentMeta = AGENT_DEFINITIONS.find((a) => a.key === agentDec.agent_key) || { avatar: '' };

      await dbRun(
        `INSERT INTO agent_decisions (id, simulation_id, agent_key, agent_name, role_title, avatar_url, status, confidence, reasoning, decision)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          decId,
          simId,
          agentDec.agent_key,
          agentDec.agent_name,
          agentDec.role_title,
          agentMeta.avatar || '',
          'COMPLETED',
          agentDec.confidence || 90,
          agentDec.reasoning,
          agentDec.decision
        ]
      );
    }

    // Store Debate Logs
    for (const debateMsg of result.debate_logs) {
      const logId = `deb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await dbRun(
        `INSERT INTO debate_logs (id, simulation_id, speaker_key, speaker_name, speaker_role, target_key, message, debate_type)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          logId,
          simId,
          debateMsg.speaker_key,
          debateMsg.speaker_name,
          debateMsg.speaker_role,
          debateMsg.target_key || 'all',
          debateMsg.message,
          debateMsg.debate_type || 'challenge'
        ]
      );
    }

    // Store Executive Report
    const repId = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    await dbRun(
      `INSERT INTO reports (id, simulation_id, executive_summary, roi_projection, risk_score, budget_breakdown_json, department_highlights_json, milestones_json, final_recommendation)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        repId,
        simId,
        result.executive_summary,
        result.roi_projection,
        result.risk_score,
        JSON.stringify(result.budget_breakdown),
        JSON.stringify(result.department_highlights),
        JSON.stringify(result.milestones),
        result.final_recommendation
      ]
    );

    res.status(201).json({
      message: 'Autonomous boardroom simulation completed successfully.',
      simulationId: simId,
      result: {
        simulation: {
          id: simId,
          title: simTitle,
          goal,
          budget: budget || '₹2 Crore',
          timeline: timeline || '6 Months',
          location: location || 'Bangalore',
          employees: employees || 25,
          marketing_spend: marketingSpend || '₹50 Lakhs'
        },
        ceo_plan: result.ceo_plan,
        agent_decisions: result.agent_decisions,
        debate_logs: result.debate_logs,
        report: {
          id: repId,
          executive_summary: result.executive_summary,
          roi_projection: result.roi_projection,
          risk_score: result.risk_score,
          budget_breakdown: result.budget_breakdown,
          department_highlights: result.department_highlights,
          milestones: result.milestones,
          final_recommendation: result.final_recommendation
        }
      }
    });
  } catch (err) {
    console.error('Run simulation error:', err);
    res.status(500).json({ error: 'Failed to execute boardroom simulation.' });
  }
});

// List User Simulations
router.get('/', authenticateToken, async (req, res) => {
  try {
    const simulations = await dbQuery(
      `SELECT s.*, r.risk_score, r.roi_projection
       FROM simulations s
       LEFT JOIN reports r ON s.id = r.simulation_id
       WHERE s.user_id = ?
       ORDER BY s.created_at DESC`,
      [req.user.id]
    );

    res.json({ simulations });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch simulation history.' });
  }
});

// Get Single Simulation with complete agent decisions, debate logs, and report
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const simulation = await dbGet('SELECT * FROM simulations WHERE id = ?', [id]);
    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found.' });
    }

    const agent_decisions = await dbQuery('SELECT * FROM agent_decisions WHERE simulation_id = ? ORDER BY created_at ASC', [id]);
    const debate_logs = await dbQuery('SELECT * FROM debate_logs WHERE simulation_id = ? ORDER BY created_at ASC', [id]);
    const rawReport = await dbGet('SELECT * FROM reports WHERE simulation_id = ?', [id]);

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
      simulation,
      agent_decisions,
      debate_logs,
      report
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch simulation details.' });
  }
});

// Compare 2 Simulations (Delta Mode)
router.get('/compare/:id1/:id2', authenticateToken, async (req, res) => {
  try {
    const { id1, id2 } = req.params;

    const sim1 = await dbGet('SELECT * FROM simulations WHERE id = ?', [id1]);
    const sim2 = await dbGet('SELECT * FROM simulations WHERE id = ?', [id2]);

    if (!sim1 || !sim2) {
      return res.status(404).json({ error: 'One or both simulations for comparison were not found.' });
    }

    const dec1 = await dbQuery('SELECT * FROM agent_decisions WHERE simulation_id = ?', [id1]);
    const dec2 = await dbQuery('SELECT * FROM agent_decisions WHERE simulation_id = ?', [id2]);

    const rep1Raw = await dbGet('SELECT * FROM reports WHERE simulation_id = ?', [id1]);
    const rep2Raw = await dbGet('SELECT * FROM reports WHERE simulation_id = ?', [id2]);

    const rep1 = rep1Raw ? { ...rep1Raw, budget_breakdown: JSON.parse(rep1Raw.budget_breakdown_json || '[]') } : null;
    const rep2 = rep2Raw ? { ...rep2Raw, budget_breakdown: JSON.parse(rep2Raw.budget_breakdown_json || '[]') } : null;

    res.json({
      simulation1: { sim: sim1, decisions: dec1, report: rep1 },
      simulation2: { sim: sim2, decisions: dec2, report: rep2 }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compare simulations.' });
  }
});

// Delete Simulation
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await dbRun('DELETE FROM agent_decisions WHERE simulation_id = ?', [id]);
    await dbRun('DELETE FROM debate_logs WHERE simulation_id = ?', [id]);
    await dbRun('DELETE FROM reports WHERE simulation_id = ?', [id]);
    await dbRun('DELETE FROM simulations WHERE id = ? AND user_id = ?', [id, req.user.id]);

    res.json({ message: 'Simulation removed successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete simulation.' });
  }
});

export default router;
