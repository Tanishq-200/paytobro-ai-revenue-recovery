import React from 'react';
import { useRecovery } from '../context/RecoveryContext.js';

interface RightAnalyticsPanelProps {
  onViewReport?: () => void;
}

export const RightAnalyticsPanel: React.FC<RightAnalyticsPanelProps> = ({ onViewReport }) => {
  const { revenueMetrics } = useRecovery();

  const barHeights = [
    30, 45, 25, 60, 40, 80, 50, 95, 70, 45, 85, 65,
    90, 75, 40, 60, 85, 100, 70, 50, 75, 90, 60, 40,
  ];

  const totalPaymentsStr = `${(revenueMetrics.totalRecoveredPayments / 1000).toFixed(1)}K`;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        height: '100%',
      }}
    >
      {/* Top Card: Total Potential Recovery (₹1.1M) */}
      <div
        className="s22-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          padding: '14px 16px',
        }}
      >
        <div>
          <div style={{ fontSize: '12.5px', color: '#94A3B8', fontWeight: 500 }}>
            Total Potential Recovery
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px', marginTop: '2px' }}>
            <span
              className="font-mono"
              style={{ fontSize: '23px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}
            >
              ₹1.1M
            </span>
            <span className="delta-pill-green">
              + 28.5%
            </span>
          </div>
        </div>

        {/* Vertical Green Bars with Time Labels */}
        <div style={{ margin: '6px 0' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '3px',
              height: '42px',
              paddingBottom: '2px',
            }}
          >
            {barHeights.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  backgroundColor: i === 17 ? '#34D399' : '#10B981',
                  borderRadius: '1.5px',
                  opacity: 0.85,
                }}
              />
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '9.5px',
              color: '#64748B',
              marginTop: '4px',
            }}
          >
            <span>12 AM</span>
            <span>6 AM</span>
            <span>12 PM</span>
            <span>6 PM</span>
            <span>11 PM</span>
          </div>
        </div>

        {/* Footer: Last 12 months | View report */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            borderTop: '1px solid #141B27',
            paddingTop: '6px',
          }}
        >
          <span style={{ color: '#64748B' }}>Last 12 months</span>
          <button
            onClick={onViewReport}
            style={{
              background: 'none',
              border: 'none',
              color: '#10B981',
              fontWeight: 600,
              fontSize: '11px',
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'var(--font-sans)',
            }}
          >
            View report
          </button>
        </div>
      </div>

      {/* Bottom Card: Total Recovered Payments (2.3K) */}
      <div
        className="s22-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          padding: '14px 16px',
        }}
      >
        <div>
          <div style={{ fontSize: '12.5px', color: '#94A3B8', fontWeight: 500 }}>
            Total Recovered Payments
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px', marginTop: '2px' }}>
            <span
              className="font-mono"
              style={{ fontSize: '23px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}
            >
              {totalPaymentsStr}
            </span>
            <span className="delta-pill-green">
              + 16.8%
            </span>
          </div>
        </div>

        {/* Trend Graph with 500, 250, 0 axis */}
        <div style={{ position: 'relative', height: '48px', margin: '4px 0' }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: '10px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              fontSize: '9px',
              color: '#64748B',
              lineHeight: 1,
            }}
          >
            <span>500</span>
            <span>250</span>
            <span>0</span>
          </div>

          <div style={{ marginLeft: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <svg viewBox="0 0 200 36" style={{ width: '100%', height: '34px', overflow: 'visible' }}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,30 Q 30,22 60,26 T 120,18 T 160,8 T 200,12"
                fill="none"
                stroke="#10B981"
                strokeWidth="1.8"
              />
              <path
                d="M 0,30 Q 30,22 60,26 T 120,18 T 160,8 T 200,12 L 200,36 L 0,36 Z"
                fill="url(#trendGrad)"
              />
              <circle cx="160" cy="8" r="3" fill="#06080D" stroke="#10B981" strokeWidth="1.8" />
            </svg>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '9.5px',
                color: '#64748B',
                marginTop: '1px',
              }}
            >
              <span>12 AM</span>
              <span>6 AM</span>
              <span>12 PM</span>
              <span>6 PM</span>
              <span>11 PM</span>
            </div>
          </div>
        </div>

        {/* Footer: Live 10k retries | View report */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            borderTop: '1px solid #141B27',
            paddingTop: '6px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
            <span style={{ color: '#64748B' }}>Live 10k retries</span>
          </div>

          <button
            onClick={onViewReport}
            style={{
              background: 'none',
              border: 'none',
              color: '#10B981',
              fontWeight: 600,
              fontSize: '11px',
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'var(--font-sans)',
            }}
          >
            View report
          </button>
        </div>
      </div>
    </div>
  );
};
