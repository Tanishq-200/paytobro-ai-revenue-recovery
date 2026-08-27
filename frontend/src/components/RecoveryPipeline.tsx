import React from 'react';
import {
  AlertOctagon,
  Search,
  Tag,
  Cpu,
  RefreshCw,
  BarChart,
  ArrowRight,
} from 'lucide-react';
import { KpiData } from '../types/index.js';

interface RecoveryPipelineProps {
  kpi: KpiData | null;
  isProcessing?: boolean;
}

export const RecoveryPipeline: React.FC<RecoveryPipelineProps> = ({ kpi, isProcessing = false }) => {
  const pipeline = kpi?.pipeline || {
    analyzed: 128,
    classified: 94,
    awaiting_action: 25,
    recovered: 18,
  };

  const stages = [
    { label: 'PAYMENT FAILED', count: pipeline.analyzed + 14, status: 'Ingesting', color: '#EF4444', icon: AlertOctagon },
    { label: 'ANALYZING', count: pipeline.analyzed, status: `${pipeline.analyzed} analyzed`, color: '#6366F1', icon: Search },
    { label: 'CLASSIFYING', count: pipeline.classified, status: `${pipeline.classified} classified`, color: '#8B5CF6', icon: Tag },
    { label: 'PREDICTING', count: pipeline.classified, status: 'Scored', color: '#38BDF8', icon: Cpu },
    { label: 'RECOVERING', count: pipeline.awaiting_action, status: `${pipeline.awaiting_action} awaiting`, color: '#F59E0B', icon: RefreshCw },
    { label: 'MEASURED', count: pipeline.recovered, status: `${pipeline.recovered} recovered`, color: '#10B981', icon: BarChart },
  ];

  return (
    <div
      className="card"
      style={{
        padding: '12px 16px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-card)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
            AI Recovery Command Center
          </span>
          <span
            style={{
              fontSize: '9px',
              padding: '1px 6px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#34D399',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <span className="status-dot status-dot-green" />
            {isProcessing ? 'Agent Active' : 'Autonomous'}
          </span>
        </div>

        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
          Target: <span style={{ color: '#10B981', fontWeight: 600 }}>~85% recoverable win rate</span>
        </span>
      </div>

      {/* Compact Horizontal Pipeline */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        {stages.map((st, idx) => {
          const Icon = st.icon;
          const isLast = idx === stages.length - 1;

          return (
            <div
              key={st.label}
              style={{
                backgroundColor: '#0A0D14',
                border: `1px solid ${st.color}2A`,
                borderRadius: 'var(--radius-sm)',
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '2px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '8.5px', fontWeight: 700, color: st.color, letterSpacing: '0.04em' }}>
                  {st.label}
                </span>
                <Icon size={11} color={st.color} />
              </div>

              <div className="font-mono" style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                {st.count}
              </div>

              <div style={{ fontSize: '9.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {st.status}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
