import { db, initializeDatabase } from './db.js';
import { evaluatePaymentRecovery } from '../recovery-engine/decision-engine.js';
export function seedDatabase(force = false) {
    initializeDatabase();
    const countRow = db.prepare('SELECT count(*) as count FROM recovery_cases').get();
    if (countRow && countRow.count > 0 && !force) {
        return; // Already seeded
    }
    // Clear existing if force
    if (force) {
        db.exec('DELETE FROM activity_feed;');
        db.exec('DELETE FROM audit_logs;');
        db.exec('DELETE FROM recovery_cases;');
        db.exec('DELETE FROM transactions;');
        db.exec('DELETE FROM customers;');
        db.exec('DELETE FROM settings;');
    }
    // Default Settings
    const insertSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    insertSetting.run('guardrails', JSON.stringify({
        max_retry_attempts: 3,
        cooldown_hours: 2,
        min_recovery_probability_threshold: 15,
        stop_on_permanent_failure: true,
        mask_sensitive_data: true,
        demo_mode_active: true,
    }));
    insertSetting.run('ai_config', JSON.stringify({
        provider: 'fallback_deterministic',
        active_mode: 'Autonomous Mode Active',
        temperature: 0.2,
    }));
    // Customers
    const insertCustomer = db.prepare(`
    INSERT INTO customers (id, name, email, phone, reliability_score, successful_payments_count, total_spent, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
    const customers = [
        { id: 'CUST_001', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+919876543210', reliability_score: 84, payments: 14, spent: 84200 },
        { id: 'CUST_002', name: 'Priya Mehta', email: 'priya.m@techcorp.in', phone: '+919823412345', reliability_score: 78, payments: 9, spent: 54100 },
        { id: 'CUST_003', name: 'Amit Verma', email: 'amit.verma@finflow.co', phone: '+919988776655', reliability_score: 88, payments: 22, spent: 145000 },
        { id: 'CUST_004', name: 'Sneha Patel', email: 'sneha.patel@designstudio.io', phone: '+919811223344', reliability_score: 75, payments: 8, spent: 39500 },
        { id: 'CUST_005', name: 'Vikram Singh', email: 'vikram@singhindustries.com', phone: '+919711002233', reliability_score: 92, payments: 31, spent: 340000 },
        { id: 'CUST_006', name: 'Neha Gupta', email: 'neha.g@gmail.com', phone: '+919655443322', reliability_score: 65, payments: 4, spent: 14200 },
        { id: 'CUST_007', name: 'Karan Malhotra', email: 'karan@malhotracapital.in', phone: '+919833445566', reliability_score: 89, payments: 18, spent: 198000 },
        { id: 'CUST_008', name: 'Ananya Roy', email: 'ananya.roy@creativeagency.in', phone: '+919744556677', reliability_score: 82, payments: 11, spent: 67300 },
        { id: 'CUST_009', name: 'Deepak Nair', email: 'deepak.nair@nairlogistics.com', phone: '+919911335577', reliability_score: 71, payments: 6, spent: 48900 },
        { id: 'CUST_010', name: 'Rohan Mehra', email: 'rohan.mehra@saasfoundry.io', phone: '+919888999000', reliability_score: 86, payments: 16, spent: 112000 },
    ];
    for (const c of customers) {
        insertCustomer.run(c.id, c.name, c.email, c.phone, c.reliability_score, c.payments, c.spent, '2026-08-01 09:00:00');
    }
    const rawCases = [
        // Highlighted cases from requirements:
        { txId: 'RZP_9281', custId: 'CUST_001', amount: 4500, method: 'UPI', reason: 'Temporary Bank Decline', code: 'BANK_TECHNICAL_ERROR', attempts: 1 },
        { txId: 'RZP_1024', custId: 'CUST_001', amount: 24500, method: 'UPI', reason: 'Temporary bank failure', code: 'ISSUER_DOWN', attempts: 1 },
        { txId: 'RZP_7741', custId: 'CUST_002', amount: 18200, method: 'Card', reason: 'Expired card', code: 'EXPIRED_CARD', attempts: 1 },
        { txId: 'RZP_8821', custId: 'CUST_003', amount: 11000, method: 'NetBanking', reason: 'Bank technical error', code: 'BANK_TECHNICAL_ERROR', attempts: 1 },
        { txId: 'RZP_3342', custId: 'CUST_004', amount: 7000, method: 'UPI', reason: 'Insufficient funds in customer account', code: 'INSUFFICIENT_BALANCE', attempts: 1 },
        { txId: 'RZP_5519', custId: 'CUST_005', amount: 50000, method: 'Card', reason: 'Issuer bank system down', code: 'ISSUER_DOWN', attempts: 1 },
        { txId: 'RZP_4412', custId: 'CUST_006', amount: 900, method: 'UPI', reason: 'Incorrect MPIN entered', code: 'AUTH_FAILED_3DS', attempts: 2 },
        { txId: 'RZP_6623', custId: 'CUST_007', amount: 35000, method: 'NetBanking', reason: 'Bank switch gateway timeout', code: 'GATEWAY_TIMEOUT', attempts: 1 },
        { txId: 'RZP_7718', custId: 'CUST_008', amount: 14800, method: 'Card', reason: 'Card validity date expired', code: 'EXPIRED_CARD', attempts: 1 },
        { txId: 'RZP_8992', custId: 'CUST_009', amount: 16500, method: 'UPI', reason: 'Bank network congestion timeout', code: 'NETWORK_TIMEOUT', attempts: 1 },
        { txId: 'RZP_9011', custId: 'CUST_010', amount: 22000, method: 'Mandate', reason: 'Recurring mandate limit exceeded', code: 'MANDATE_LIMIT_EXCEEDED', attempts: 1 },
        // Additional active cases to build the full dataset
        { txId: 'RZP_1120', custId: 'CUST_003', amount: 28000, method: 'Card', reason: 'Issuer server unresponsive', code: 'ISSUER_UNAVAILABLE', attempts: 1 },
        { txId: 'RZP_1121', custId: 'CUST_005', amount: 42000, method: 'UPI', reason: 'NPCI UPI switch temporary timeout', code: 'SWITCH_UNAVAILABLE', attempts: 1 },
        { txId: 'RZP_1122', custId: 'CUST_007', amount: 15400, method: 'UPI', reason: 'Customer account low balance', code: 'INSUFFICIENT_BALANCE', attempts: 1 },
        { txId: 'RZP_1123', custId: 'CUST_002', amount: 9800, method: 'Card', reason: '3DS OTP submission timeout', code: 'OTP_EXPIRED', attempts: 1 },
        { txId: 'RZP_1124', custId: 'CUST_004', amount: 12500, method: 'NetBanking', reason: 'Core banking host communication error', code: 'BANK_TECHNICAL_ERROR', attempts: 2 },
        { txId: 'RZP_1125', custId: 'CUST_006', amount: 3200, method: 'UPI', reason: 'Temporary bank decline', code: 'DECLINED_BY_BANK', attempts: 1 },
        { txId: 'RZP_1126', custId: 'CUST_008', amount: 19500, method: 'Card', reason: 'Account flagged for review', code: 'ACCOUNT_FROZEN', attempts: 1 },
        // Enterprise high-value cohorts matching exact ₹12.4L revenue at risk
        { txId: 'RZP_1127', custId: 'CUST_001', amount: 120000, method: 'Card', reason: 'Temporary bank switch host down', code: 'ISSUER_DOWN', attempts: 1 },
        { txId: 'RZP_1128', custId: 'CUST_005', amount: 240000, method: 'NetBanking', reason: 'Bank core technical error', code: 'BANK_TECHNICAL_ERROR', attempts: 1 },
        { txId: 'RZP_1129', custId: 'CUST_003', amount: 185000, method: 'Card', reason: 'Issuer switch timeout at gateway', code: 'SWITCH_UNAVAILABLE', attempts: 1 },
        { txId: 'RZP_1130', custId: 'CUST_007', amount: 165000, method: 'NetBanking', reason: 'Temporary bank decline', code: 'DECLINED_BY_BANK', attempts: 1 },
        { txId: 'RZP_1131', custId: 'CUST_002', amount: 95000, method: 'Card', reason: 'Expired card on corporate subscription', code: 'EXPIRED_CARD', attempts: 1 },
        { txId: 'RZP_1132', custId: 'CUST_008', amount: 65000, method: 'UPI', reason: 'Insufficient funds on debit account', code: 'INSUFFICIENT_BALANCE', attempts: 1 },
        { txId: 'RZP_1133', custId: 'CUST_010', amount: 35200, method: 'UPI', reason: 'Bank network congestion timeout', code: 'NETWORK_TIMEOUT', attempts: 1 },
        // Recovered cases contributing to the ₹3.2L Revenue Recovered metric
        { txId: 'RZP_4001', custId: 'CUST_005', amount: 95000, method: 'Card', reason: 'Temporary bank decline', code: 'ISSUER_DOWN', attempts: 2, isRecovered: true, recoveredAmount: 95000, recoveredAt: '2026-08-27 16:45:00' },
        { txId: 'RZP_4002', custId: 'CUST_003', amount: 62000, method: 'UPI', reason: 'Network timeout', code: 'NETWORK_TIMEOUT', attempts: 1, isRecovered: true, recoveredAmount: 62000, recoveredAt: '2026-08-27 17:15:00' },
        { txId: 'RZP_4003', custId: 'CUST_007', amount: 48000, method: 'NetBanking', reason: 'Temporary bank failure', code: 'BANK_TECHNICAL_ERROR', attempts: 2, isRecovered: true, recoveredAmount: 48000, recoveredAt: '2026-08-27 18:30:00' },
        { txId: 'RZP_4004', custId: 'CUST_001', amount: 38000, method: 'UPI', reason: 'Temporary bank decline', code: 'ISSUER_UNAVAILABLE', attempts: 1, isRecovered: true, recoveredAmount: 38000, recoveredAt: '2026-08-27 19:10:00' },
        { txId: 'RZP_4005', custId: 'CUST_004', amount: 26000, method: 'Card', reason: 'Card expired', code: 'EXPIRED_CARD', attempts: 1, isRecovered: true, recoveredAmount: 26000, recoveredAt: '2026-08-27 20:00:00' },
        { txId: 'RZP_4006', custId: 'CUST_002', amount: 22000, method: 'UPI', reason: 'Insufficient funds', code: 'INSUFFICIENT_BALANCE', attempts: 1, isRecovered: true, recoveredAmount: 22000, recoveredAt: '2026-08-27 21:00:00' },
        { txId: 'RZP_4007', custId: 'CUST_010', amount: 19000, method: 'UPI', reason: 'Network timeout', code: 'NETWORK_TIMEOUT', attempts: 1, isRecovered: true, recoveredAmount: 19000, recoveredAt: '2026-08-27 21:40:00' },
        { txId: 'RZP_4008', custId: 'CUST_008', amount: 10000, method: 'UPI', reason: 'Temporary bank decline', code: 'BANK_TECHNICAL_ERROR', attempts: 1, isRecovered: true, recoveredAmount: 10000, recoveredAt: '2026-08-27 22:15:00' },
    ];
    const insertTx = db.prepare(`
    INSERT INTO transactions (id, customer_id, amount, currency, payment_method, gateway, failure_code, failure_reason, status, attempts_count, max_attempts, initiated_at, failed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    const insertCase = db.prepare(`
    INSERT INTO recovery_cases (
      id, transaction_id, customer_id, customer_name, customer_email, amount, payment_method,
      failure_code, failure_reason, failure_category, failure_category_label, confidence_score,
      recovery_probability, potential_recovery, recommended_action, recommended_action_label,
      action_delay_hours, priority, priority_score, status, ai_explanation, decision_factors_json,
      timeline_json, attempts_count, max_attempts, created_at, updated_at, recovered_at, recovered_amount
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    const insertAudit = db.prepare(`
    INSERT INTO audit_logs (id, case_id, transaction_id, timestamp, event_type, failure_category, confidence, recommended_action, rationale, outcome)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    let caseIndex = 1;
    for (const rc of rawCases) {
        const cust = customers.find((c) => c.id === rc.custId);
        const caseId = `CASE_${String(caseIndex).padStart(4, '0')}`;
        caseIndex++;
        const decision = evaluatePaymentRecovery({
            failureReason: rc.reason,
            failureCode: rc.code,
            amount: rc.amount,
            paymentMethod: rc.method,
            attemptsCount: rc.attempts,
            customerReliability: cust.reliability_score,
        });
        const isRecovered = !!rc.isRecovered;
        const status = isRecovered ? 'recovered' : 'recovery_pending';
        const timeline = [
            { id: '1', title: 'Payment initiated', timestamp: '10:31 AM', status: 'completed', description: `Initiated via ${rc.method} gateway` },
            { id: '2', title: 'Bank declined payment', timestamp: '10:31 AM', status: 'completed', description: rc.reason },
            { id: '3', title: 'AI analysis completed', timestamp: '10:32 AM', status: 'completed', description: `Classified as ${decision.failure_category_label} (${decision.confidence_score}% confidence)` },
            { id: '4', title: 'Recovery recommendation generated', timestamp: '10:32 AM', status: 'completed', description: decision.recommended_action_label },
            {
                id: '5',
                title: isRecovered ? 'Recovery completed' : 'Recovery pending',
                timestamp: isRecovered ? (rc.recoveredAt ? rc.recoveredAt.slice(11, 16) : '02:35 PM') : 'Pending',
                status: isRecovered ? 'completed' : 'pending',
                description: isRecovered ? `Recovered ₹${rc.amount.toLocaleString('en-IN')} successfully via simulated execution` : 'Awaiting autonomous execution window',
            },
        ];
        insertTx.run(rc.txId, rc.custId, rc.amount, 'INR', rc.method, 'Razorpay Test', rc.code, rc.reason, isRecovered ? 'recovered' : 'failed', rc.attempts, 3, '2026-08-27 10:31:00', '2026-08-27 10:31:30');
        insertCase.run(caseId, rc.txId, rc.custId, cust.name, cust.email, rc.amount, rc.method, rc.code, rc.reason, decision.failure_category, decision.failure_category_label, decision.confidence_score, decision.recovery_probability, rc.amount, decision.recommended_action, decision.recommended_action_label, decision.action_delay_hours || null, decision.priority, decision.priority_score, status, decision.ai_explanation, JSON.stringify(decision.decision_factors), JSON.stringify(timeline), rc.attempts, 3, '2026-08-27 10:32:00', isRecovered ? rc.recoveredAt : '2026-08-27 10:32:00', isRecovered ? (rc.recoveredAt || null) : null, isRecovered ? (rc.recoveredAmount ?? null) : null);
        // Audit logs
        insertAudit.run(`AUD_${caseId}_1`, caseId, rc.txId, '02:31 PM', 'CLASSIFICATION', decision.failure_category_label, decision.confidence_score, decision.recommended_action_label, `AI identified ${decision.failure_category_label} with ${decision.confidence_score}% confidence.`, 'CLASSIFIED');
        insertAudit.run(`AUD_${caseId}_2`, caseId, rc.txId, '02:32 PM', 'PROBABILITY_ESTIMATION', decision.failure_category_label, decision.confidence_score, decision.recommended_action_label, `Recovery probability calculated at ${decision.recovery_probability}%. Recommended strategy: ${decision.recommended_action_label}`, 'RECOMMENDED');
        if (isRecovered) {
            insertAudit.run(`AUD_${caseId}_3`, caseId, rc.txId, '02:35 PM', 'SIMULATION_EXECUTED', decision.failure_category_label, decision.confidence_score, decision.recommended_action_label, `Recovery executed in safe simulation mode. Captured ₹${rc.amount.toLocaleString('en-IN')}.`, 'RECOVERED');
        }
    }
    // Live Agent Activity Feed items
    const insertActivity = db.prepare(`
    INSERT INTO activity_feed (id, timestamp, transaction_id, event_type, description, amount, confidence, badge_color)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
    const activities = [
        { id: 'ACT_1', time: 'Just now', tx: 'RZP_9281', type: 'DECISION', desc: 'AI identified temporary bank failure', amount: 4500, conf: 94, color: 'blue' },
        { id: 'ACT_2', time: '2m ago', tx: 'RZP_1024', type: 'OPPORTUNITY', desc: '₹24,500 recovery opportunity detected', amount: 24500, conf: 92, color: 'purple' },
        { id: 'ACT_3', time: '4m ago', tx: 'RZP_9281', type: 'PROBABILITY', desc: 'Recovery probability calculated: 82%', amount: 4500, conf: 82, color: 'indigo' },
        { id: 'ACT_4', time: '6m ago', tx: 'RZP_1024', type: 'SCHEDULED', desc: 'Retry scheduled for 2 hours', amount: 24500, conf: 92, color: 'amber' },
        { id: 'ACT_5', time: '11m ago', tx: 'RZP_4008', type: 'RECOVERED', desc: '₹10,000 successfully recovered', amount: 10000, conf: 96, color: 'green' },
        { id: 'ACT_6', time: '18m ago', tx: 'RZP_7741', type: 'DECISION', desc: 'Alternative payment link generated for expired card', amount: 18200, conf: 98, color: 'blue' },
        { id: 'ACT_7', time: '25m ago', tx: 'RZP_4007', type: 'RECOVERED', desc: '₹19,000 successfully recovered', amount: 19000, conf: 91, color: 'green' },
    ];
    for (const a of activities) {
        insertActivity.run(a.id, a.time, a.tx, a.type, a.desc, a.amount, a.conf, a.color);
    }
}
