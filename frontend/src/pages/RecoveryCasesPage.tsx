import React, { useState } from 'react';
import { Download, Search } from 'lucide-react';
import { useRecovery } from '../context/RecoveryContext.js';

interface RecoveryCasesPageProps {
  onSelectCase: (caseId: string) => void;
  title?: string;
  initialStatus?: string;
  initialPriority?: string;
}

export const RecoveryCasesPage: React.FC<RecoveryCasesPageProps> = ({
  onSelectCase,
  title = 'Recovery Cases',
  initialStatus = 'all',
}) => {
  const { cases } = useRecovery();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCases = cases.filter((c) => {
    if (initialStatus === 'recovery_pending' && c.status === 'Recovered') return false;
    if (initialStatus === 'recovered' && c.status !== 'Recovered') return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        c.txId.toLowerCase().includes(q) ||
        c.customerName.toLowerCase().includes(q) ||
        c.failureType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {/* Title & Subtitle */}
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          {title}
        </h2>
        <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
          Search, filter and manage payment recovery cases across all failure cohorts.
        </p>
      </div>

      {/* Screen 23 Search Bar with Export Data Button */}
      <div className="s22-card" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={14}
              color="#64748B"
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search transactions, customers, failure reasons, IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#070A0F',
                border: '1px solid #1A2230',
                borderRadius: 'var(--radius-sm)',
                padding: '7px 12px 7px 32px',
                fontSize: '12.5px',
                color: '#F1F5F9',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
              }}
            />
          </div>

          <button
            onClick={() => alert('Exporting recovery transactions to CSV...')}
            className="btn-dark-outline"
          >
            <Download size={13} color="#94A3B8" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Screen 23 Table with 12.5px Typography */}
      <div className="s22-card" style={{ padding: '10px 14px' }}>
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
            {filteredCases.map((c) => (
              <tr
                key={c.txId}
                onClick={() => onSelectCase(c.txId)}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <span className="font-mono" style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '12px' }}>
                    {c.txId}
                  </span>
                </td>
                <td>
                  <span style={{ color: '#E2E8F0', fontWeight: 500 }}>{c.customerName}</span>
                </td>
                <td>
                  <span className="font-mono" style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '13px' }}>
                    ₹{c.amount.toLocaleString('en-IN')}
                  </span>
                </td>
                <td>
                  <span style={{ color: '#94A3B8' }}>{c.failureType}</span>
                </td>
                <td>
                  <span
                    className="font-mono"
                    style={{
                      color: c.recoveryProbability >= 80 ? '#10B981' : c.recoveryProbability >= 60 ? '#FACC15' : '#F59E0B',
                      fontWeight: 600,
                      fontSize: '12px',
                    }}
                  >
                    {c.recoveryProbability}%
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span
                    className={
                      c.status === 'Recovered'
                        ? 'status-pill-recovered'
                        : 'status-pill-pending'
                    }
                  >
                    {c.status}
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
