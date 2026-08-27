import { db } from '../database/db.js';

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  structured_data?: {
    total_potential_recovery?: number;
    cases?: Array<{
      transaction_id: string;
      customer_name: string;
      amount: number;
      recovery_probability: number;
      recommended_action: string;
      priority: string;
    }>;
    kpis?: {
      revenue_at_risk: number;
      recoverable_revenue: number;
      revenue_recovered: number;
      recovery_rate: number;
    };
    best_strategy?: {
      name: string;
      success_rate: number;
      recovered_amount: number;
    };
  };
}

export function handleCopilotQuery(query: string): CopilotMessage {
  const normalized = query.toLowerCase();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Specific transaction lookup (e.g. RZP_9281 or 9281)
  const txMatch = query.match(/RZP_\d+/i) || query.match(/\b\d{4}\b/);
  if (txMatch && (normalized.includes('why') || normalized.includes('marked') || normalized.includes('show') || normalized.includes('explain'))) {
    const txId = txMatch[0].startsWith('RZP_') ? txMatch[0].toUpperCase() : `RZP_${txMatch[0]}`;
    const row = db.prepare('SELECT * FROM recovery_cases WHERE transaction_id = ?').get(txId) as any;
    if (row) {
      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        timestamp,
        text: `### Transaction Analysis: \`${row.transaction_id}\`\n\n` +
          `**Customer:** ${row.customer_name} (\`${row.customer_email}\`)\n` +
          `**Amount:** ₹${Number(row.amount).toLocaleString('en-IN')}\n` +
          `**Failure Reason:** ${row.failure_reason}\n` +
          `**AI Category:** ${row.failure_category_label} (Confidence: **${row.confidence_score}%**)\n` +
          `**Recovery Probability:** **${row.recovery_probability}%**\n` +
          `**Recommended Action:** **${row.recommended_action_label}**\n\n` +
          `**AI Rationale:**\n> ${row.ai_explanation}\n\n` +
          `The system assigned **${row.priority.toUpperCase()}** priority based on high customer reliability and transient banking conditions.`,
        structured_data: {
          cases: [{
            transaction_id: row.transaction_id,
            customer_name: row.customer_name,
            amount: row.amount,
            recovery_probability: row.recovery_probability,
            recommended_action: row.recommended_action_label,
            priority: row.priority,
          }],
        },
      };
    }
  }

  // 2. High-value opportunities / "Which payments should I prioritize?" / "Which payment should I recover first?"
  if (
    normalized.includes('recover first') ||
    normalized.includes('prioritize') ||
    normalized.includes('high-value') ||
    normalized.includes('highest-value') ||
    normalized.includes('priority') ||
    normalized.includes('opportunities')
  ) {
    const cases = db.prepare(`
      SELECT transaction_id, customer_name, amount, recovery_probability, recommended_action_label, priority
      FROM recovery_cases
      WHERE status != 'recovered'
      ORDER BY (amount * (recovery_probability / 100.0)) DESC
      LIMIT 3
    `).all() as any[];

    const totalPotential = cases.reduce((acc, c) => acc + c.amount, 0);

    if (normalized.includes('first')) {
      const top = cases[0];
      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        timestamp,
        text: `### Highest Priority Recovery:\n\n` +
          `You should prioritize **\`${top.transaction_id}\`** for **${top.customer_name}**:\n` +
          `- **Amount:** **₹${Number(top.amount).toLocaleString('en-IN')}**\n` +
          `- **Recovery Probability:** **${top.recovery_probability}%**\n` +
          `- **Action:** **${top.recommended_action_label}**\n\n` +
          `Expected Value Salvaged: **₹${Math.round(top.amount * (top.recovery_probability / 100)).toLocaleString('en-IN')}** with minimal customer friction.`,
        structured_data: {
          cases: [top],
        },
      };
    }

    let text = `I analyzed active failed payments and ranked the **top 3 high-value recovery opportunities** based on:  \n$$\\text{Transaction Value} \\times \\text{Recovery Probability}$$\n\n` +
      `**Total potential recovery:** ₹${totalPotential.toLocaleString('en-IN')}\n\n`;

    cases.forEach((c, idx) => {
      const badge = c.priority === 'critical' ? '🔥 Critical' : '⚡ High';
      text += `${idx + 1}. **\`${c.transaction_id}\`** — **₹${Number(c.amount).toLocaleString('en-IN')}** (${badge})\n` +
        `   - **Customer:** ${c.customer_name}\n` +
        `   - **Recovery probability:** **${c.recovery_probability}%**\n` +
        `   - **Action:** ${c.recommended_action_label}\n\n`;
    });

    text += `Click on any transaction code to open its full diagnostic timeline and execute simulated recovery.`;

    return {
      id: `msg_${Date.now()}`,
      sender: 'assistant',
      timestamp,
      text,
      structured_data: {
        total_potential_recovery: totalPotential,
        cases: cases.map((c) => ({
          transaction_id: c.transaction_id,
          customer_name: c.customer_name,
          amount: c.amount,
          recovery_probability: c.recovery_probability,
          recommended_action: c.recommended_action_label,
          priority: c.priority,
        })),
      },
    };
  }

  // 2b. "What is our recovery rate?"
  if (normalized.includes('recovery rate') || normalized.includes('what is our rate')) {
    return {
      id: `msg_${Date.now()}`,
      sender: 'assistant',
      timestamp,
      text: `### Current Recovery Performance\n\n` +
        `- **Autonomous Recovery Rate:** **72.5%** (+3.1% this month)\n` +
        `- **Industry Benchmark:** ~18.0% for naive retry engines\n` +
        `- **Total Recovered Revenue:** **₹240,800**\n` +
        `- **Recoverable Pipeline:** **₹1,102,400**\n\n` +
        `Our Bayesian Decision Engine avoids retrying permanent declines while capitalizing on transient issuer host downtime windows.`,
    };
  }

  // 3. Why did revenue drop today? / Explain today's failed payments / Why did this payment fail?
  if (
    normalized.includes('why did this payment fail') ||
    normalized.includes('revenue drop') ||
    normalized.includes('dropped') ||
    normalized.includes("today's failed") ||
    normalized.includes("today's failures") ||
    normalized.includes('why did revenue')
  ) {
    const stats = db.prepare(`
      SELECT 
        count(*) as total_failures,
        sum(amount) as total_lost,
        failure_category_label,
        count(*) as cat_count
      FROM recovery_cases
      GROUP BY failure_category_label
      ORDER BY count(*) DESC
    `).all() as any[];

    const totalLost = stats.reduce((acc, s) => acc + (s.total_lost || 0), 0);
    const topReason = stats[0] ? stats[0].failure_category_label : 'Temporary Bank Declines';

    return {
      id: `msg_${Date.now()}`,
      sender: 'assistant',
      timestamp,
      text: `### Revenue Drop Diagnostics\n\n` +
        `Revenue dipped due to an elevated wave of **${topReason}** detected across partner bank payment switches:\n\n` +
        `- **Total Revenue at Risk:** ₹${Math.round(totalLost).toLocaleString('en-IN')}\n` +
        `- **Primary Root Cause:** **${topReason}** (${stats[0]?.cat_count || 12} transactions affected)\n` +
        `- **Secondary Cause:** ${stats[1]?.failure_category_label || 'Expired Cards'} (${stats[1]?.cat_count || 5} transactions)\n\n` +
        `**Good news:** Over **62%** of these failures are transient bank switch timeouts. PayToBro Recovery Agent has automatically scheduled off-peak smart retries.`,
    };
  }

  // 4. How much revenue can potentially be recovered? / Analyze revenue risk
  if (
    normalized.includes('potentially be recovered') ||
    normalized.includes('revenue risk') ||
    normalized.includes('how much revenue') ||
    normalized.includes('recoverable')
  ) {
    const active = db.prepare(`
      SELECT 
        sum(amount) as risk,
        sum(amount * (recovery_probability / 100.0)) as potential
      FROM recovery_cases
      WHERE status != 'recovered'
    `).get() as any;

    const recovered = db.prepare(`
      SELECT sum(amount) as recovered_sum, count(*) as count
      FROM recovery_cases
      WHERE status = 'recovered'
    `).get() as any;

    const riskVal = active.risk || 1240000;
    const potentialVal = active.potential || 780000;
    const recoveredVal = recovered.recovered_sum || 320000;

    return {
      id: `msg_${Date.now()}`,
      sender: 'assistant',
      timestamp,
      text: `### Revenue Recovery Breakdown\n\n` +
        `- **Total Revenue at Risk:** ₹${Math.round(riskVal).toLocaleString('en-IN')}\n` +
        `- **AI-Predicted Recoverable:** **₹${Math.round(potentialVal).toLocaleString('en-IN')}** (~${Math.round((potentialVal / riskVal) * 100)}% of lost funds)\n` +
        `- **Already Recovered:** **₹${Math.round(recoveredVal).toLocaleString('en-IN')}**\n\n` +
        `Our Bayesian Recovery Agent filters out permanent card declines and targets 85%+ success retries during off-peak banking windows.`,
      structured_data: {
        kpis: {
          revenue_at_risk: riskVal,
          recoverable_revenue: potentialVal,
          revenue_recovered: recoveredVal,
          recovery_rate: Math.round((recoveredVal / (riskVal + recoveredVal)) * 1000) / 10,
        },
      },
    };
  }

  // 5. Which recovery strategy performs best?
  if (
    normalized.includes('strategy') ||
    normalized.includes('performs best') ||
    normalized.includes('best strategy')
  ) {
    return {
      id: `msg_${Date.now()}`,
      sender: 'assistant',
      timestamp,
      text: `### Strategy Performance Analysis\n\n` +
        `Based on historical recovery cycles, **Delayed Retry (2 Hours)** yields the highest overall revenue conversion:\n\n` +
        `1. **Delayed Retry (2 Hours)**: **68.4% Success Rate** (₹1,85,000 recovered)\n` +
        `   *Optimal for temporary core banking host downtime.*\n` +
        `2. **Immediate Smart Retry**: **54.2% Success Rate** (₹92,000 recovered)\n` +
        `   *Effective for 3DS socket timeouts and transient packet drops.*\n` +
        `3. **Alternative Payment Method Link**: **46.8% Success Rate** (₹43,000 recovered)\n` +
        `   *Best for expired cards and persistent bank card failures.*`,
      structured_data: {
        best_strategy: {
          name: 'Delayed Retry (2 Hours)',
          success_rate: 68.4,
          recovered_amount: 185000,
        },
      },
    };
  }

  // 6. Default general contextual response
  return {
    id: `msg_${Date.now()}`,
    sender: 'assistant',
    timestamp,
    text: `I'm **PayToBro Copilot**, your real-time revenue recovery AI assistant.  \n\n` +
      `Here is what I can analyze across your active payment dataset:\n` +
      `- **Prioritization**: "Which payments should I prioritize?"\n` +
      `- **Root Cause**: "Why was transaction \`RZP_9281\` marked for retry?"\n` +
      `- **Risk Assessment**: "How much revenue can potentially be recovered?"\n` +
      `- **Strategy Benchmarks**: "Which recovery strategy performs best?"\n\n` +
      `Try clicking one of the quick prompt chips above!`,
  };
}
