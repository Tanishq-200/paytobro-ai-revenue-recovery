import React from 'react';
import { Activity, ArrowUpRight, Clock, ShieldCheck, Zap } from 'lucide-react';
import { AgentActivityEvent } from '../types/index.js';

interface ActivityFeedProps {
  activities: AgentActivityEvent[];
  onSelectTransaction?: (txId: string) => void;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, onSelectTransaction }) => {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '440px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} color="#6366F1" />
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Live AI Agent Activity
          </h3>
        </div>
        <span
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span className="status-dot status-dot-green animate-pulse-subtle" />
          Streaming events
        </span>
      </div>

      {/* Feed List */}
      <div
        style={{
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          paddingRight: '4px',
        }}
      >
        {activities.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0', fontSize: '12px' }}>
            No agent activities recorded yet.
          </div>
        ) : (
          activities.map((act) => {
            const isRecovered = act.event_type === 'RECOVERED';
            const isOpportunity = act.event_type === 'OPPORTUNITY';

            return (
              <div
                key={act.id}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isRecovered
                    ? 'rgba(16, 185, 129, 0.05)'
                    : 'var(--bg-surface-elevated)',
                  border: isRecovered
                    ? '1px solid rgba(16, 185, 129, 0.25)'
                    : '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  transition: 'background-color var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: isRecovered ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isRecovered ? (
                      <ShieldCheck size={13} color="#10B981" />
                    ) : (
                      <Zap size={13} color="#818CF8" />
                    )}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        color: isRecovered ? '#34D399' : 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {act.description}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <button
                        onClick={() => onSelectTransaction?.(act.transaction_id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#818CF8',
                          fontFamily: 'var(--font-mono)',
                          cursor: 'pointer',
                          padding: 0,
                          fontSize: '11px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        {act.transaction_id}
                        <ArrowUpRight size={10} />
                      </button>

                      <span>•</span>

                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={10} />
                        {act.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Confidence badge */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: isRecovered ? 'var(--success)' : 'var(--text-primary)',
                    }}
                  >
                    ₹{Number(act.amount).toLocaleString('en-IN')}
                  </div>

                  {act.confidence && (
                    <span
                      style={{
                        fontSize: '10px',
                        color: '#94A3B8',
                      }}
                    >
                      {act.confidence}% conf
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
