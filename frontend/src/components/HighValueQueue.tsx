import React from 'react';
import { Flame, Zap, ArrowRight, ShieldAlert } from 'lucide-react';
import { RecoveryCase } from '../types/index.js';

interface HighValueQueueProps {
  cases: RecoveryCase[];
  onAnalyzeCase: (caseId: string) => void;
  onViewAll?: () => void;
}

export const HighValueQueue: React.FC<HighValueQueueProps> = ({ cases, onAnalyzeCase, onViewAll }) => {
  return (
    <div className="card" style={{ padding: '24px', marginBottom: '28px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={18} color="#EF4444" />
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Highest-Value Recovery Opportunities
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Prioritized automatically by <span className="font-mono" style={{ color: '#818CF8' }}>Transaction Value × Recovery Probability</span>.
          </p>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '12px', gap: '4px' }}
          >
            <span>View all cases</span>
            <ArrowRight size={13} />
          </button>
        )}
      </div>

      {/* Grid of Opportunities */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px',
        }}
      >
        {cases.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '20px 0' }}>
            No high-priority recovery cases pending at this moment.
          </div>
        ) : (
          cases.map((c) => {
            const isCritical = c.priority === 'critical';

            return (
              <div
                key={c.id}
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: isCritical ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  transition: 'border-color var(--transition-fast), transform var(--transition-fast)',
                }}
              >
                {/* Priority Badge & Tx ID */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className={`badge ${isCritical ? 'badge-critical' : 'badge-high'}`}>
                    {isCritical ? <Flame size={12} /> : <Zap size={12} />}
                    {isCritical ? 'Critical Priority' : 'High Priority'}
                  </span>

                  <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {c.transaction_id}
                  </span>
                </div>

                {/* Customer & Amount */}
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {c.customer_name}
                  </div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: '22px',
                      fontWeight: 700,
                      color: '#F8FAFC',
                      letterSpacing: '-0.02em',
                      marginTop: '2px',
                    }}
                  >
                    ₹{Number(c.amount).toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Failure Reason & Probability */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-app)',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '11px',
                  }}
                >
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {c.failure_category_label || c.failure_reason}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Recovery Probability:</span>
                    <span
                      className="font-mono"
                      style={{
                        fontWeight: 700,
                        color: c.recovery_probability >= 80 ? '#10B981' : '#F59E0B',
                      }}
                    >
                      {c.recovery_probability}%
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => onAnalyzeCase(c.id)}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', gap: '6px' }}
                >
                  <span>Analyze</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
