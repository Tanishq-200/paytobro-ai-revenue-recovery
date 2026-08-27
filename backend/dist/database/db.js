import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
const DB_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
}
const DB_PATH = path.join(DB_DIR, 'paytobro.db');
export const db = new DatabaseSync(DB_PATH);
export function initializeDatabase() {
    // Enable foreign keys
    db.exec('PRAGMA foreign_keys = ON;');
    // Customers table
    db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      reliability_score INTEGER NOT NULL,
      successful_payments_count INTEGER NOT NULL,
      total_spent REAL NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
    // Transactions table
    db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'INR',
      payment_method TEXT NOT NULL,
      gateway TEXT NOT NULL DEFAULT 'Razorpay Test',
      failure_code TEXT NOT NULL,
      failure_reason TEXT NOT NULL,
      status TEXT NOT NULL,
      attempts_count INTEGER NOT NULL DEFAULT 1,
      max_attempts INTEGER NOT NULL DEFAULT 3,
      initiated_at TEXT NOT NULL,
      failed_at TEXT NOT NULL,
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    );
  `);
    // Recovery Cases table
    db.exec(`
    CREATE TABLE IF NOT EXISTS recovery_cases (
      id TEXT PRIMARY KEY,
      transaction_id TEXT NOT NULL UNIQUE,
      customer_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      amount REAL NOT NULL,
      payment_method TEXT NOT NULL,
      failure_code TEXT NOT NULL,
      failure_reason TEXT NOT NULL,
      failure_category TEXT NOT NULL,
      failure_category_label TEXT NOT NULL,
      confidence_score INTEGER NOT NULL,
      recovery_probability INTEGER NOT NULL,
      potential_recovery REAL NOT NULL,
      recommended_action TEXT NOT NULL,
      recommended_action_label TEXT NOT NULL,
      action_delay_hours INTEGER,
      priority TEXT NOT NULL,
      priority_score REAL NOT NULL,
      status TEXT NOT NULL,
      ai_explanation TEXT NOT NULL,
      decision_factors_json TEXT NOT NULL,
      timeline_json TEXT NOT NULL,
      attempts_count INTEGER NOT NULL DEFAULT 1,
      max_attempts INTEGER NOT NULL DEFAULT 3,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      recovered_at TEXT,
      recovered_amount REAL,
      FOREIGN KEY (transaction_id) REFERENCES transactions(id),
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    );
  `);
    // Audit Logs table
    db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      transaction_id TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      event_type TEXT NOT NULL,
      failure_category TEXT,
      confidence INTEGER,
      recommended_action TEXT,
      rationale TEXT NOT NULL,
      outcome TEXT
    );
  `);
    // Live Activity Events table
    db.exec(`
    CREATE TABLE IF NOT EXISTS activity_feed (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      transaction_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      confidence INTEGER,
      badge_color TEXT
    );
  `);
    // Guardrails and System Settings table
    db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}
