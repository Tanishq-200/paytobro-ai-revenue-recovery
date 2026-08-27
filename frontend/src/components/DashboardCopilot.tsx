import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, ArrowUpRight } from 'lucide-react';
import { useRecovery } from '../context/RecoveryContext.js';

interface DashboardCopilotProps {
  onSelectTransaction?: (txId: string) => void;
}

export const DashboardCopilot: React.FC<DashboardCopilotProps> = ({ onSelectTransaction }) => {
  const { cases, revenueMetrics, runSimulation, isSimulating } = useRecovery();

  const [messages, setMessages] = useState<Array<{ id: string; sender: 'user' | 'assistant'; text: string; structured?: any }>>([]);
  const [inputVal, setInputVal] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const endRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    'Find highest-value recoveries',
    "Explain today's failures",
    'Which payments should I prioritize?',
    'How much revenue can we recover?',
  ];

  const handleSend = async (queryText?: string) => {
    const text = queryText || inputVal.trim();
    if (!text) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user' as const,
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputVal('');
    setIsTyping(true);

    const norm = text.toLowerCase();
    await new Promise((r) => setTimeout(r, 600));

    let reply = '';
    let structured: any = null;

    if (norm.includes('run') && (norm.includes('simulation') || norm.includes('agent') || norm.includes('recovery'))) {
      reply = 'Starting autonomous recovery pipeline simulation now across all active failed payments...';
      runSimulation();
    } else if (norm.includes('prioritize') || norm.includes('first') || norm.includes('highest-value') || norm.includes('find')) {
      const topPending = cases.filter((c) => c.status !== 'Recovered').sort((a, b) => (b.amount * b.recoveryProbability) - (a.amount * a.recoveryProbability));
      if (topPending.length > 0) {
        const top = topPending[0];
        reply = `**${top.txId}** is the highest-value opportunity with **₹${top.amount.toLocaleString('en-IN')}** at **${top.recoveryProbability}%** recovery probability (${top.recommendedAction}).`;
        structured = { cases: topPending.slice(0, 3) };
      } else {
        reply = 'All high-value opportunities have been successfully recovered!';
      }
    } else if (norm.includes('how much') && (norm.includes('recover') || norm.includes('revenue') || norm.includes('agent'))) {
      const formattedRec = revenueMetrics.revenueRecovered.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      const kCount = (revenueMetrics.totalRecoveredPayments / 1000).toFixed(1);
      reply = `The agent has recovered **₹${formattedRec}** across **${kCount}K payments** (${revenueMetrics.recoveryRate.toFixed(1)}% recovery rate).`;
    } else if (norm.includes('today') || norm.includes('fail') || norm.includes('why')) {
      reply = 'Today, **48%** of declines were caused by temporary bank issuer switch downtime, **24%** by expired cards, and **18%** by insufficient funds. The autonomous agent is routing each through optimal cooldown delays.';
    } else {
      reply = `I analyzed our active payment telemetry. We currently have **₹${revenueMetrics.recoverableRevenue.toLocaleString('en-IN')}** in recoverable volume across ${cases.length} tracked cohorts.`;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `asst_${Date.now()}`,
        sender: 'assistant',
        text: reply,
        structured,
      },
    ]);
    setIsTyping(false);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div
      className="s22-card"
      style={{
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: '220px',
      }}
    >
      <div>
        {/* Header */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.2 }}>
            PayToBro Copilot
          </div>
          <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
            Ask anything about your recovery data.
          </div>
        </div>

        {/* Input Bar with Green Send Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#070A0F',
            border: '1px solid #182233',
            borderRadius: 'var(--radius-sm)',
            padding: '2px 4px 2px 10px',
            marginBottom: '10px',
          }}
        >
          <input
            type="text"
            placeholder="Ask anything..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isTyping || isSimulating}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#F1F5F9',
              fontSize: '12.5px',
              outline: 'none',
              padding: '5px 0',
              fontFamily: 'var(--font-sans)',
            }}
          />

          <button
            type="submit"
            disabled={isTyping || !inputVal.trim()}
            style={{
              width: '26px',
              height: '26px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#10B981',
              border: 'none',
              color: '#06150E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isTyping || !inputVal.trim() ? 'not-allowed' : 'pointer',
              opacity: isTyping || !inputVal.trim() ? 0.4 : 1,
              transition: 'all var(--transition-fast)',
            }}
          >
            <Send size={12} fill="currentColor" />
          </button>
        </form>

        {/* Messages Stream */}
        {messages.length > 0 && (
          <div
            style={{
              maxHeight: '115px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              marginBottom: '8px',
              paddingRight: '2px',
              fontSize: '12px',
            }}
          >
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '90%',
                    backgroundColor: isUser ? '#16202E' : '#080C14',
                    border: isUser ? '1px solid #233044' : '1px solid #141C28',
                    color: isUser ? '#FFFFFF' : '#E2E8F0',
                    borderRadius: '4px',
                    padding: '6px 8px',
                    lineHeight: 1.4,
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: m.text
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/`(.*?)`/g, '<code style="color:#38BDF8;">$1</code>'),
                    }}
                  />

                  {m.structured?.cases && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '5px' }}>
                      {m.structured.cases.map((c: any) => (
                        <button
                          key={c.txId}
                          onClick={() => onSelectTransaction?.(c.txId)}
                          style={{
                            background: '#0F1624',
                            border: '1px solid #1E2B40',
                            borderRadius: '3px',
                            padding: '2.5px 6px',
                            color: '#38BDF8',
                            fontSize: '10.5px',
                            fontFamily: 'var(--font-mono)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '2px',
                          }}
                        >
                          {c.txId} (₹{c.amount.toLocaleString('en-IN')})
                          <ArrowUpRight size={10} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {isTyping && (
              <div style={{ fontSize: '11px', color: '#818CF8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Sparkles size={11} />
                <span>Copilot is analyzing recovery data...</span>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}

        {/* Quick Actions Grid */}
        <div>
          <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, marginBottom: '5px' }}>
            Quick Actions
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '5px',
            }}
          >
            {quickActions.map((qa, i) => (
              <button
                key={i}
                onClick={() => handleSend(qa)}
                disabled={isTyping || isSimulating}
                style={{
                  backgroundColor: '#080C14',
                  border: '1px solid #172030',
                  color: '#94A3B8',
                  borderRadius: 'var(--radius-sm)',
                  padding: '5px 7px',
                  fontSize: '11.5px',
                  fontWeight: 500,
                  textAlign: 'center',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  transition: 'all var(--transition-fast)',
                  fontFamily: 'var(--font-sans)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#10B981';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#172030';
                  e.currentTarget.style.color = '#94A3B8';
                }}
              >
                {qa}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div
        style={{
          fontSize: '10.5px',
          color: '#475569',
          marginTop: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <Sparkles size={10} color="#64748B" />
        <span>AI responses may be generated. Verify critical actions.</span>
      </div>
    </div>
  );
};
