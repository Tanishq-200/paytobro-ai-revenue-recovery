import { db } from '../database/db.js';
import { evaluatePaymentRecovery } from '../recovery-engine/decision-engine.js';
const FIRST_NAMES = ['Aarav', 'Ananya', 'Rohan', 'Pooja', 'Vikram', 'Divya', 'Siddharth', 'Meera', 'Kavita', 'Aditya', 'Ishaan', 'Tanvi', 'Suresh', 'Deepika', 'Manish'];
const LAST_NAMES = ['Sharma', 'Verma', 'Patel', 'Reddy', 'Mehta', 'Nair', 'Iyer', 'Chatterjee', 'Gupta', 'Singh', 'Deshmukh', 'Joshi'];
export function generateSimulationDataset(params) {
    const { transactionCount = 20, averageAmount = 12000 } = params;
    // Clear existing active (unrecovered) cases
    db.exec("DELETE FROM recovery_cases WHERE status != 'recovered'");
    const insertCustomer = db.prepare(`
    INSERT OR IGNORE INTO customers (id, name, email, phone, reliability_score, successful_payments_count, total_spent, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
    const insertTx = db.prepare(`
    INSERT OR REPLACE INTO transactions (id, customer_id, amount, currency, payment_method, gateway, failure_code, failure_reason, status, attempts_count, max_attempts, initiated_at, failed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    const insertCase = db.prepare(`
    INSERT OR REPLACE INTO recovery_cases (
      id, transaction_id, customer_id, customer_name, customer_email, amount, payment_method,
      failure_code, failure_reason, failure_category, failure_category_label, confidence_score,
      recovery_probability, potential_recovery, recommended_action, recommended_action_label,
      action_delay_hours, priority, priority_score, status, ai_explanation, decision_factors_json,
      timeline_json, attempts_count, max_attempts, created_at, updated_at, recovered_at, recovered_amount
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    let totalAtRisk = 0;
    let totalPotential = 0;
    const generatedCases = [];
    const methods = ['UPI', 'Card', 'NetBanking'];
    const failureTypes = [
        { reason: 'Temporary Bank Decline', code: 'BANK_TECHNICAL_ERROR' },
        { reason: 'Issuer server unresponsive', code: 'ISSUER_DOWN' },
        { reason: 'Insufficient account balance', code: 'INSUFFICIENT_BALANCE' },
        { reason: 'Expired debit/credit card', code: 'EXPIRED_CARD' },
        { reason: '3DS OTP timeout dropped by user', code: 'OTP_EXPIRED' },
        { reason: 'Network socket timeout', code: 'GATEWAY_TIMEOUT' },
    ];
    for (let i = 0; i < transactionCount; i++) {
        const num = 1000 + i;
        const txId = `RZP_${num}`;
        const custId = `CUST_SIM_${(i % 12) + 1}`;
        const fName = FIRST_NAMES[i % FIRST_NAMES.length];
        const lName = LAST_NAMES[(i * 3) % LAST_NAMES.length];
        const custName = `${fName} ${lName}`;
        const custEmail = `${fName.toLowerCase()}.${lName.toLowerCase()}@example.com`;
        // Vary amount normally around averageAmount
        const variation = (Math.random() * 0.8) + 0.6; // 0.6 to 1.4
        const amount = Math.round((averageAmount * variation) / 100) * 100;
        const method = methods[i % methods.length];
        const failure = failureTypes[i % failureTypes.length];
        const reliability = Math.floor(Math.random() * 30) + 68; // 68 - 98
        insertCustomer.run(custId, custName, custEmail, `+9198${String(10000000 + i).slice(-8)}`, reliability, Math.floor(Math.random() * 15) + 3, amount * 4, '2026-08-20 10:00:00');
        const decision = evaluatePaymentRecovery({
            failureReason: failure.reason,
            failureCode: failure.code,
            amount,
            paymentMethod: method,
            attemptsCount: 1,
            customerReliability: reliability,
        });
        const timeline = [
            { id: '1', title: 'Payment initiated', timestamp: '11:15 AM', status: 'completed', description: `Initiated via ${method}` },
            { id: '2', title: 'Bank declined payment', timestamp: '11:15 AM', status: 'completed', description: failure.reason },
            { id: '3', title: 'AI analysis completed', timestamp: '11:16 AM', status: 'completed', description: `Classified as ${decision.failure_category_label}` },
            { id: '4', title: 'Recovery recommendation generated', timestamp: '11:16 AM', status: 'completed', description: decision.recommended_action_label },
            { id: '5', title: 'Recovery pending', timestamp: 'Pending', status: 'pending', description: 'Scheduled in Recovery Agent queue' },
        ];
        insertTx.run(txId, custId, amount, 'INR', method, 'Razorpay Test', failure.code, failure.reason, 'failed', 1, 3, '2026-08-27 11:15:00', '2026-08-27 11:15:30');
        const caseId = `CASE_SIM_${num}`;
        insertCase.run(caseId, txId, custId, custName, custEmail, amount, method, failure.code, failure.reason, decision.failure_category, decision.failure_category_label, decision.confidence_score, decision.recovery_probability, amount, decision.recommended_action, decision.recommended_action_label, decision.action_delay_hours || null, decision.priority, decision.priority_score, 'recovery_pending', decision.ai_explanation, JSON.stringify(decision.decision_factors), JSON.stringify(timeline), 1, 3, '2026-08-27 11:16:00', '2026-08-27 11:16:00', null, null);
        totalAtRisk += amount;
        totalPotential += Math.round(amount * (decision.recovery_probability / 100));
        generatedCases.push({
            id: caseId,
            transaction_id: txId,
            customer_id: custId,
            customer_name: custName,
            customer_email: custEmail,
            amount,
            payment_method: method,
            failure_code: failure.code,
            failure_reason: failure.reason,
            failure_category: decision.failure_category,
            failure_category_label: decision.failure_category_label,
            confidence_score: decision.confidence_score,
            recovery_probability: decision.recovery_probability,
            potential_recovery: amount,
            recommended_action: decision.recommended_action,
            recommended_action_label: decision.recommended_action_label,
            priority: decision.priority,
            priority_score: decision.priority_score,
            status: 'recovery_pending',
            ai_explanation: decision.ai_explanation,
            decision_factors: decision.decision_factors,
            timeline: timeline,
            attempts_count: 1,
            max_attempts: 3,
            created_at: '2026-08-27 11:16:00',
            updated_at: '2026-08-27 11:16:00',
        });
    }
    return {
        transactionsGenerated: transactionCount,
        totalRevenueAtRisk: totalAtRisk,
        potentiallyRecoverable: totalPotential,
        predictedRecovery: Math.round(totalPotential * 0.88),
        cases: generatedCases,
    };
}
export function executeFullRecoverySimulation() {
    const pendingCases = db.prepare(`
    SELECT * FROM recovery_cases WHERE status != 'recovered'
  `).all();
    let recoveredRevenue = 0;
    let recoveredCount = 0;
    let failedCount = 0;
    const updateCase = db.prepare(`
    UPDATE recovery_cases
    SET status = 'recovered', recovered_at = datetime('now'), recovered_amount = amount, updated_at = datetime('now'),
        timeline_json = ?
    WHERE id = ?
  `);
    const insertAudit = db.prepare(`
    INSERT INTO audit_logs (id, case_id, transaction_id, timestamp, event_type, failure_category, confidence, recommended_action, rationale, outcome)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    const insertActivity = db.prepare(`
    INSERT INTO activity_feed (id, timestamp, transaction_id, event_type, description, amount, confidence, badge_color)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
    for (const c of pendingCases) {
        const prob = c.recovery_probability;
        // Monte Carlo outcome based on recovery probability
        const roll = Math.random() * 100;
        const isSuccessful = roll <= prob;
        if (isSuccessful) {
            recoveredRevenue += c.amount;
            recoveredCount++;
            let timeline = [];
            try {
                timeline = JSON.parse(c.timeline_json);
            }
            catch {
                timeline = [];
            }
            timeline.push({
                id: 'sim_rec',
                title: 'Recovery executed successfully',
                timestamp: 'Just now',
                status: 'completed',
                description: `Executed via ${c.recommended_action_label}. Funds recovered in simulated sandbox.`,
            });
            updateCase.run(JSON.stringify(timeline), c.id);
            insertAudit.run(`AUD_SIM_${c.id}_${Date.now()}`, c.id, c.transaction_id, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 'RECOVERY_SUCCEEDED', c.failure_category_label, c.confidence_score, c.recommended_action_label, `Autonomous execution succeeded via ${c.recommended_action_label}. Probability: ${c.recovery_probability}%.`, 'RECOVERED');
            insertActivity.run(`ACT_SIM_${Date.now()}_${recoveredCount}`, 'Just now', c.transaction_id, 'RECOVERED', `₹${Number(c.amount).toLocaleString('en-IN')} successfully recovered`, c.amount, c.recovery_probability, 'green');
        }
        else {
            failedCount++;
        }
    }
    // Calculate global metrics from DB
    const totals = db.prepare(`
    SELECT
      SUM(CASE WHEN status != 'recovered' THEN amount ELSE 0 END) as at_risk,
      SUM(CASE WHEN status != 'recovered' THEN amount * (recovery_probability / 100.0) ELSE 0 END) as potential,
      SUM(CASE WHEN status = 'recovered' THEN amount ELSE 0 END) as total_recovered,
      SUM(amount) as all_revenue
    FROM recovery_cases
  `).get();
    const totalAtRisk = totals.at_risk || 0;
    const totalPotential = totals.potential || 0;
    const allRevenueRecovered = totals.total_recovered || recoveredRevenue;
    const totalAllRevenue = totals.all_revenue || 1;
    const recoveryRate = Math.round((allRevenueRecovered / totalAllRevenue) * 1000) / 10;
    const steps = [
        { stage: 'Analyzing', message: `Analyzed ${pendingCases.length} pending transactions`, processedCount: pendingCases.length, totalCount: pendingCases.length },
        { stage: 'Classifying', message: 'Classified failure taxonomy and issuer codes', processedCount: pendingCases.length, totalCount: pendingCases.length },
        { stage: 'Predicting', message: 'Calculated Bayesian recovery probabilities', processedCount: pendingCases.length, totalCount: pendingCases.length },
        { stage: 'Selecting Strategy', message: 'Assigned optimal delayed retries, alt rails & reminders', processedCount: pendingCases.length, totalCount: pendingCases.length },
        { stage: 'Executing Recovery', message: `Executed safe sandbox simulations for ${pendingCases.length} cases`, processedCount: pendingCases.length, totalCount: pendingCases.length },
        { stage: 'Measuring Outcome', message: `Quantified ₹${recoveredRevenue.toLocaleString('en-IN')} recovered revenue`, processedCount: pendingCases.length, totalCount: pendingCases.length },
    ];
    return {
        revenueAtRisk: totalAtRisk,
        potentialRecovery: Math.round(totalPotential),
        revenueRecovered: allRevenueRecovered,
        recoveryRate,
        recoveredCount,
        failedCount,
        steps,
    };
}
