import React from 'react';
import { useRecovery } from '../context/RecoveryContext.js';

interface RecentRecoveryCasesProps {
  onSelectCase: (caseOrTxId: string) => void;
  onViewAll?: () => void;
}

export const RecentRecoveryCases: React.FC<RecentRecoveryCasesProps> = ({
  onSelectCase,
  onViewAll,
}) => {
  const { cases } = useRecovery();

  const displayRows = cases.slice(0, 4);

  return (
    <div className="s22-card" style={{ padding: '14px 16px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}
      >
        <div style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF' }}>
          Recent Recovery Cases
        </div>

        <button
          onClick={onViewAll}
          style={{
            background: 'none',
            border: 'none',
            color: '#10B981',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0,
            fontFamily: 'var(--font-sans)',
          }}
        >
          View all
        </button>
      </div>

      {/* Screen 22 Table with 12.5px Typography */}
      <table className="s22-table">
        <thead>
          <tr>
            <th style={{ width: '115px' }}>Transaction ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Failure Reason</th>
            <th style={{ width: '140px' }}>Recovery Probability</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {displayRows.map((r) => {
            const isRecovered = r.status === 'Recovered';
            return (
              <tr key={r.txId}>
                {/* Transaction ID */}
                <td>
                  <span
                    onClick={() => onSelectCase(r.txId)}
                    className="font-mono"
                    style={{
                      color: '#94A3B8',
                      cursor: 'pointer',
                      fontWeight: 500,
                      fontSize: '12px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#38BDF8')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                  >
                    {r.txId}
                  </span>
                </td>

                {/* Customer */}
                <td>
                  <span style={{ color: '#E2E8F0', fontWeight: 500 }}>{r.customerName}</span>
                </td>

                {/* Amount */}
                <td>
                  <span className="font-mono" style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '13px' }}>
                    ₹{r.amount.toLocaleString('en-IN')}
                  </span>
                </td>

                {/* Failure Reason */}
                <td>
                  <span style={{ color: '#94A3B8' }}>{r.failureType}</span>
                </td>

                {/* Recovery Probability */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <span className="font-mono" style={{ fontSize: '11.5px', color: '#E2E8F0', width: '28px' }}>
                      {r.recoveryProbability}%
                    </span>
                    <div
                      style={{
                        width: '70px',
                        height: '4px',
                        backgroundColor: '#161E2C',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${r.recoveryProbability}%`,
                          height: '100%',
                          backgroundColor: r.recoveryProbability >= 80 ? '#10B981' : r.recoveryProbability >= 60 ? '#FACC15' : '#F59E0B',
                        }}
                      />
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td>
                  <span className={isRecovered ? 'status-pill-recovered' : 'status-pill-pending'}>
                    {r.status}
                  </span>
                </td>

                {/* Action */}
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => onSelectCase(r.txId)}
                    className="btn-analyze-green"
                    style={{
                      backgroundColor: isRecovered ? 'rgba(16, 185, 129, 0.15)' : '#0A1412',
                      borderColor: isRecovered ? '#10B981' : 'rgba(16, 185, 129, 0.4)',
                    }}
                  >
                    {isRecovered ? 'View Case' : 'Analyze'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
