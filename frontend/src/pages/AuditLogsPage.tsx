import React from 'react';

interface AuditLogsPageProps {
  onSelectCase?: (caseId: string) => void;
}

export const AuditLogsPage: React.FC<AuditLogsPageProps> = ({ onSelectCase }) => {
  const logs = [
    { tx: 'RZP_9281', customer: 'Rahul Sharma', amount: '₹24,500', failure: 'Bank decline', prob: 92, status: 'Pending' },
    { tx: 'RZP_9282', customer: 'Priya Mehta', amount: '₹18,200', failure: 'Expired card', prob: 78, status: 'Pending' },
    { tx: 'RZP_9283', customer: 'Amit Verma', amount: '₹7,800', failure: 'Insufficient funds', prob: 64, status: 'Recovered' },
    { tx: 'RZP_9284', customer: 'Sneha Kapoor', amount: '₹4,300', failure: 'Auth failure', prob: 51, status: 'Pending' },
    { tx: 'RZP_9285', customer: 'Arjun Rao', amount: '₹12,600', failure: 'Network issue', prob: 86, status: 'Recovering' },
    { tx: 'RZP_9286', customer: 'Neha Jain', amount: '₹9,800', failure: 'Bank decline', prob: 81, status: 'Pending' },
  ];

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Audit Logs
        </h2>
        <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
          Immutable ledger of autonomous recovery decisions, webhook events, and strategy evaluations.
        </p>
      </div>

      <div className="s22-card" style={{ padding: '18px' }}>
        <div style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '14px' }}>
          Decision Audit Trail
        </div>

        <table className="s22-table">
          <thead>
            <tr>
              <th style={{ width: '135px' }}>Transaction</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Failure</th>
              <th style={{ width: '130px' }}>Probability</th>
              <th style={{ textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr
                key={l.tx}
                onClick={() => onSelectCase?.(l.tx)}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <span className="font-mono" style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '12px' }}>
                    {l.tx}
                  </span>
                </td>
                <td>
                  <span style={{ color: '#E2E8F0', fontWeight: 500 }}>{l.customer}</span>
                </td>
                <td>
                  <span className="font-mono" style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '13px' }}>
                    {l.amount}
                  </span>
                </td>
                <td>
                  <span style={{ color: '#94A3B8' }}>{l.failure}</span>
                </td>
                <td>
                  <span
                    className="font-mono"
                    style={{
                      color: l.prob >= 80 ? '#10B981' : l.prob >= 60 ? '#FACC15' : '#F59E0B',
                      fontWeight: 600,
                      fontSize: '12px',
                    }}
                  >
                    {l.prob}%
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span
                    className={
                      l.status === 'Recovered'
                        ? 'status-pill-recovered'
                        : 'status-pill-pending'
                    }
                  >
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
