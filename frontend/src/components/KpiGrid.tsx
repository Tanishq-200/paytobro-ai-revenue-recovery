import React from 'react';
import { Shield, AlertTriangle, TrendingUp, Target } from 'lucide-react';
import { useRecovery } from '../context/RecoveryContext.js';

export const KpiGrid: React.FC = () => {
  const { revenueMetrics } = useRecovery();

  const formattedAtRisk = revenueMetrics.revenueAtRisk.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedRecoverable = revenueMetrics.recoverableRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedRecovered = revenueMetrics.revenueRecovered.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedRate = `${revenueMetrics.recoveryRate.toFixed(1)}%`;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
      }}
    >
      {/* 1. Revenue at Risk */}
      <div className="s22-card" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12.5px', color: '#94A3B8', fontWeight: 500 }}>
            Revenue at Risk
          </span>
          <div className="kpi-icon-circle kpi-icon-red">
            <Shield size={13} fill="currentColor" fillOpacity={0.2} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px' }}>
          <span
            className="font-mono"
            style={{ fontSize: '23px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}
          >
            ₹{formattedAtRisk}
          </span>
          <span className="delta-pill-green">
            + 28.4%
          </span>
        </div>

        <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '4.5px', height: '4.5px', borderRadius: '50%', backgroundColor: '#10B981' }} />
          <span>vs previous 7 days</span>
        </div>
      </div>

      {/* 2. Recoverable Revenue */}
      <div className="s22-card" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12.5px', color: '#94A3B8', fontWeight: 500 }}>
            Recoverable Revenue
          </span>
          <div className="kpi-icon-circle kpi-icon-amber">
            <AlertTriangle size={13} fill="currentColor" fillOpacity={0.2} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px' }}>
          <span
            className="font-mono"
            style={{ fontSize: '23px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}
          >
            ₹{formattedRecoverable}
          </span>
          <span className="delta-pill-green">
            + 18.7%
          </span>
        </div>

        <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '4.5px', height: '4.5px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
          <span>of total failed volume</span>
        </div>
      </div>

      {/* 3. Revenue Recovered */}
      <div className="s22-card" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12.5px', color: '#94A3B8', fontWeight: 500 }}>
            Revenue Recovered
          </span>
          <div className="kpi-icon-circle kpi-icon-green">
            <TrendingUp size={13} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px' }}>
          <span
            className="font-mono"
            style={{ fontSize: '23px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}
          >
            ₹{formattedRecovered}
          </span>
          <span className="delta-pill-green">
            + 24.6%
          </span>
        </div>

        <div style={{ fontSize: '11px', color: '#64748B' }}>
          via PayToBro AI Agent
        </div>
      </div>

      {/* 4. Recovery Rate */}
      <div className="s22-card" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12.5px', color: '#94A3B8', fontWeight: 500 }}>
            Recovery Rate
          </span>
          <div className="kpi-icon-circle kpi-icon-blue">
            <Target size={13} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px' }}>
          <span
            className="font-mono"
            style={{ fontSize: '23px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}
          >
            {formattedRate}
          </span>
          <span className="delta-pill-green">
            + 3.1%
          </span>
        </div>

        <div style={{ fontSize: '11px', color: '#64748B' }}>
          Autonomous execution rate
        </div>
      </div>
    </div>
  );
};
