import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { dbGet, dbRun } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'shadowboard_enterprise_super_secret_jwt_key_2026_x99';

// Ensure a default demo executive exists in database for seamless trial
const ensureDefaultDemoUser = async () => {
  try {
    const demoEmail = 'ceo@shadowboard.ai';
    const existing = await dbGet('SELECT * FROM users WHERE email = ?', [demoEmail]);
    if (!existing) {
      const hashedPassword = await bcrypt.hash('shadowboard2026', 10);
      const userId = 'usr_demo_executive_001';
      await dbRun(
        'INSERT INTO users (id, name, email, password, organization, role) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, 'Alex Vance (Executive Demo)', demoEmail, hashedPassword, 'Enterprise Dynamics Corp', 'Group CEO & Founder']
      );
    }
  } catch (err) {
    console.error('Error seeding demo user:', err);
  }
};
ensureDefaultDemoUser();

// Register Endpoint
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, organization, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existingUser = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    await dbRun(
      'INSERT INTO users (id, name, email, password, organization, role) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name, email, hashedPassword, organization || 'Enterprise AI Labs', role || 'Executive Director']
    );

    const token = jwt.sign({ id: userId, email, name, role: role || 'Executive Director' }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: { id: userId, name, email, organization: organization || 'Enterprise AI Labs', role: role || 'Executive Director' }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Failed to create account.' });
  }
});

// Login Endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organization: user.organization,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Authentication failed.' });
  }
});

// Quick Demo Login Endpoint
router.post('/demo-login', async (req, res) => {
  try {
    const user = await dbGet('SELECT * FROM users WHERE email = ?', ['ceo@shadowboard.ai']);
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      message: 'Demo executive login granted.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organization: user.organization,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Demo login error.' });
  }
});

// Me Profile Endpoint
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await dbGet('SELECT id, name, email, organization, role, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'User profile not found.' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
});

export default router;
