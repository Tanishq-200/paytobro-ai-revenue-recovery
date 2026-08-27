import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useRecovery } from '../context/RecoveryContext.js';

interface CopilotPageProps {
  onSelectTransaction?: (txId: string) => void;
}

export const CopilotPage: React.FC<CopilotPageProps> = ({ onSelectTransaction }) => {
  const { cases, revenueMetrics, runSimulation, isSimulating } = useRecovery();

  const [messages, setMessages] = useState<Array<{ id: string; sender: 'user' | 'assistant'; text: string; structured?: any }>>([
    {
      id: 'init',
      sender: 'assistant',
      text: 'I found 3 high-value recovery opportunities.\n\n**Total potential recovery: ₹42,500**',
      structured: {
        cases: [
          { txId: 'RZP_9281', customerName: 'Rahul Sharma', amount: 24500, recoveryProbability: 92 },
          { txId: 'RZP_7741', customerName: 'Priya Mehta', amount: 18200, recoveryProbability: 78 },
          { txId: 'RZP_6671', customerName: 'Amit Verma', amount: 7800, recoveryProbability: 64 },
        ],
      },
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (customQuery?: string) => {
    const q = customQuery || inputVal.trim();
    if (!q) return;

    setMessages((prev) => [...prev, { id: `usr_${Date.now()}`, sender: 'user', text: q }]);
    if (!customQuery) setInputVal('');
    setIsTyping(true);

    const norm = q.toLowerCase();
    await new Promise((r) => setTimeout(r, 600));

    let reply = '';
    let structured: any = null;

    if (norm.includes('run') && (norm.includes('simulation') || norm.includes('agent') || norm.includes('recovery'))) {
      reply = 'Starting autonomous recovery pipeline simulation now across all active failed payments...';
      runSimulation();
    } else if (norm.includes('prioritize') || norm.includes('first') || norm.includes('highest')) {
      const topPending = cases.filter((c) => c.status !== 'Recovered').sort((a, b) => (b.amount * b.recoveryProbability) - (a.amount * a.recoveryProbability));
      if (topPending.length > 0) {
        const top = topPending[0];
        reply = `**${top.txId}** is the highest-value opportunity with **₹${top.amount.toLocaleString('en-IN')}** at **${top.recoveryProbability}%** recovery probability (${top.recommendedAction}).`;
        structured = { cases: topPending.slice(0, 3) };
      } else {
        reply = 'All high-value recovery opportunities have already been processed!';
      }
    } else if (norm.includes('how much') || norm.includes('recovered')) {
      const formattedRec = revenueMetrics.revenueRecovered.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      const kCount = (revenueMetrics.totalRecoveredPayments / 1000).toFixed(1);
      reply = `The agent has recovered **₹${formattedRec}** across **${kCount}K payments** (${revenueMetrics.recoveryRate.toFixed(1)}% recovery rate).`;
    } else {
      reply = `We currently have **₹${revenueMetrics.revenueAtRisk.toLocaleString('en-IN')}** revenue at risk, of which **₹${revenueMetrics.recoverableRevenue.toLocaleString('en-IN')}** is recoverable via Bayesian heuristics.`;
    }

    setMessages((prev) => [...prev, { id: `asst_${Date.now()}`, sender: 'assistant', text: reply, structured }]);
    setIsTyping(false);
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          PayToBro Copilot
        </h2>
        <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
          AI assistant for revenue recovery intelligence and automated triage.
        </p>
      </div>

      {/* Screen 32-33 Copilot Main Card */}
      <div
        className="s22-card"
        style={{
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '480px',
        }}
      >
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '3px' }}>
            PayToBro Copilot
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '20px' }}>
            Ask questions using your recovery data.
          </div>

          {/* Conversation Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: isUser ? '#FFFFFF' : '#10B981' }}>
                    {isUser ? 'You' : 'Copilot'}
                  </div>

                  <div style={{ color: '#F1F5F9', fontSize: '13px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                    {m.text}
                  </div>

                  {/* Transaction Pills */}
                  {m.structured?.cases && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px', maxWidth: '420px' }}>
                      {m.structured.cases.map((c: any) => (
                        <div
                          key={c.txId}
                          onClick={() => onSelectTransaction?.(c.txId)}
                          style={{
                            backgroundColor: '#070A0F',
                            border: '1px solid #182233',
                            borderRadius: 'var(--radius-md)',
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                          }}
                        >
                          <span className="font-mono" style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '12.5px' }}>
                            {c.txId} — ₹{Number(c.amount).toLocaleString('en-IN')} — {c.recoveryProbability}%
                          </span>
                          <ArrowUpRight size={13} color="#10B981" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div style={{ fontSize: '12px', color: '#818CF8' }}>
                Analyzing recovery data...
              </div>
            )}
          </div>
        </div>

        {/* Input Field with Send Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#070A0F',
            border: '1px solid #1A2333',
            borderRadius: 'var(--radius-sm)',
            padding: '4px 6px 4px 14px',
            marginTop: '22px',
          }}
        >
          <input
            type="text"
            placeholder="Ask anything about your payments..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isTyping || isSimulating}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '12.5px',
              outline: 'none',
              padding: '6px 0',
              fontFamily: 'var(--font-sans)',
            }}
          />

          <button
            type="submit"
            disabled={isTyping || !inputVal.trim()}
            className="btn-emerald"
            style={{ padding: '7px 18px' }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
