import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../shadowboard.db');

// Ensure db directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const verboseSqlite = sqlite3.verbose();
const db = new verboseSqlite.Database(dbPath);

db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      organization TEXT DEFAULT 'Autonomous Corp',
      role TEXT DEFAULT 'Executive Director',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Simulations table
  db.run(`
    CREATE TABLE IF NOT EXISTS simulations (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      title TEXT NOT NULL,
      goal TEXT NOT NULL,
      budget TEXT,
      timeline TEXT,
      location TEXT,
      employees INTEGER,
      marketing_spend TEXT,
      status TEXT DEFAULT 'COMPLETED',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Agent Decisions table
  db.run(`
    CREATE TABLE IF NOT EXISTS agent_decisions (
      id TEXT PRIMARY KEY,
      simulation_id TEXT NOT NULL,
      agent_key TEXT NOT NULL,
      agent_name TEXT NOT NULL,
      role_title TEXT NOT NULL,
      avatar_url TEXT,
      status TEXT DEFAULT 'COMPLETED',
      confidence INTEGER DEFAULT 90,
      reasoning TEXT NOT NULL,
      decision TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (simulation_id) REFERENCES simulations (id) ON DELETE CASCADE
    )
  `);

  // Debate Logs table
  db.run(`
    CREATE TABLE IF NOT EXISTS debate_logs (
      id TEXT PRIMARY KEY,
      simulation_id TEXT NOT NULL,
      speaker_key TEXT NOT NULL,
      speaker_name TEXT NOT NULL,
      speaker_role TEXT NOT NULL,
      target_key TEXT,
      message TEXT NOT NULL,
      debate_type TEXT DEFAULT 'challenge', -- challenge, rebuttal, agreement, synthesis
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (simulation_id) REFERENCES simulations (id) ON DELETE CASCADE
    )
  `);

  // Reports table
  db.run(`
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      simulation_id TEXT UNIQUE NOT NULL,
      executive_summary TEXT NOT NULL,
      roi_projection TEXT NOT NULL,
      risk_score INTEGER NOT NULL,
      budget_breakdown_json TEXT NOT NULL,
      department_highlights_json TEXT NOT NULL,
      milestones_json TEXT NOT NULL,
      final_recommendation TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (simulation_id) REFERENCES simulations (id) ON DELETE CASCADE
    )
  `);

  // Store Campaigns table for live demo website
  db.run(`
    CREATE TABLE IF NOT EXISTS store_campaigns (
      id TEXT PRIMARY KEY,
      is_active INTEGER DEFAULT 0,
      title TEXT NOT NULL,
      discount_percentage INTEGER DEFAULT 40,
      promo_code TEXT DEFAULT 'DIWALI-SHADOW40',
      banner_text TEXT NOT NULL,
      marketing_spend TEXT,
      target_category TEXT DEFAULT 'ALL CATEGORIES',
      occasion_key TEXT DEFAULT 'seasonal',
      deployed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      simulation_id TEXT
    )
  `);

  // Migration for existing database
  db.run(`ALTER TABLE store_campaigns ADD COLUMN occasion_key TEXT DEFAULT 'seasonal'`, (err) => {
    // Ignore error if column already exists
  });
});

// Async helper utilities
export const dbQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export default db;
