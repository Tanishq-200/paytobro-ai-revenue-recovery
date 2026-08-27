import React, { useState } from 'react';
import { ArrowRight, TrendingUp, AlertTriangle, Shield, Target, Clock, ArrowDownRight, Layers } from 'lucide-react';
import { useRecovery } from '../context/RecoveryContext.js';

type TimeRange = '7D' | '30D' | '90D' | '12M';

export const AnalyticsPage: React.FC = () => {
  const { pipelineStats, revenueMetrics } = useRecovery();
  const [timeRange, setTimeRange] = useState<TimeRange>('12M');
  const [hoveredStageIdx, setHoveredStageIdx] = useState<number | null>(null);
  const [hoveredMonthIdx, setHoveredMonthIdx] = useState<number | null>(5); // default Jun

  // Multipliers based on time range
  const timeMultiplier = timeRange === '7D' ? 0.22 : timeRange === '30D' ? 0.45 : timeRange === '90D' ? 0.75 : 1.0;

  // Dynamically adjusted pipeline numbers from context & time filter
  const failedCount = Math.round(pipelineStats.failed * timeMultiplier);
  const analyzingCount = Math.round(pipelineStats.analyzing * timeMultiplier);
  const classifyingCount = Math.round(pipelineStats.classified * timeMultiplier);
  const predictingCount = Math.round(pipelineStats.predicting * timeMultiplier);
  const recoveringCount = Math.round(pipelineStats.recovering * timeMultiplier);
  const measuredCount = Math.round(pipelineStats.measured * timeMultiplier);

  // Dynamic flow stages with percentage of previous stage and detailed hover metrics
  const flowStages = [
    {
      name: 'PAYMENT FAILED',
      count: failedCount,
      pctOfPrev: '100%',
      color: '#EF4444',
      volume: `₹${((revenueMetrics.revenueAtRisk * timeMultiplier) / 100000).toFixed(1)}L`,
      avgTime: 'Real-time',
      desc: 'Failed webhook triggers ingested from gateway',
    },
    {
      name: 'ANALYZING',
      count: analyzingCount,
      pctOfPrev: `${((analyzingCount / (failedCount || 1)) * 100).toFixed(1)}%`,
      color: '#38BDF8',
      volume: `₹${(((revenueMetrics.revenueAtRisk * 0.9) * timeMultiplier) / 100000).toFixed(1)}L`,
      avgTime: '1.2 sec',
      desc: 'Downtime & customer profile analysis',
    },
    {
      name: 'CLASSIFYING',
      count: classifyingCount,
      pctOfPrev: `${((classifyingCount / (analyzingCount || 1)) * 100).toFixed(1)}%`,
      color: '#818CF8',
      volume: `₹${(((revenueMetrics.revenueAtRisk * 0.74) * timeMultiplier) / 100000).toFixed(1)}L`,
      avgTime: '0.8 sec',
      desc: 'Taxonomy root-cause classification',
    },
    {
      name: 'PREDICTING',
      count: predictingCount,
      pctOfPrev: `${((predictingCount / (classifyingCount || 1)) * 100).toFixed(1)}%`,
      color: '#A855F7',
      volume: `₹${((revenueMetrics.recoverableRevenue * timeMultiplier) / 100000).toFixed(1)}L`,
      avgTime: '0.5 sec',
      desc: 'Bayesian probability scoring',
    },
    {
      name: 'RECOVERING',
      count: recoveringCount,
      pctOfPrev: `${((recoveringCount / (predictingCount || 1)) * 100).toFixed(1)}%`,
      color: '#F59E0B',
      volume: `₹${(((revenueMetrics.recoverableRevenue * 0.35) * timeMultiplier) / 100000).toFixed(1)}L`,
      avgTime: 'Cooldown delay',
      desc: 'Active retry & alternative rail execution',
    },
    {
      name: 'MEASURED',
      count: measuredCount,
      pctOfPrev: `${((measuredCount / (recoveringCount || 1)) * 100).toFixed(1)}%`,
      color: '#10B981',
      volume: `₹${((revenueMetrics.revenueRecovered * timeMultiplier) / 100000).toFixed(1)}L`,
      avgTime: 'Immediate',
      desc: 'Revenue salvaged and captured into ledger',
    },
  ];

  // 12 Months Data Series for Recovery Performance Chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const performanceData = [
    { month: 'Jan', failed: 160, recoverable: 110, recovered: 25 },
    { month: 'Feb', failed: 185, recoverable: 130, recovered: 38 },
    { month: 'Mar', failed: 170, recoverable: 120, recovered: 32 },
    { month: 'Apr', failed: 210, recoverable: 155, recovered: 50 },
    { month: 'May', failed: 230, recoverable: 165, recovered: 70 },
    { month: 'Jun', failed: 245, recoverable: 180, recovered: 98 },
    { month: 'Jul', failed: 220, recoverable: 160, recovered: 85 },
    { month: 'Aug', failed: 260, recoverable: 195, recovered: 120 },
    { month: 'Sep', failed: 250, recoverable: 185, recovered: 110 },
    { month: 'Oct', failed: 280, recoverable: 205, recovered: 135 },
    { month: 'Nov', failed: 295, recoverable: 215, recovered: 150 },
    { month: 'Dec', failed: 310, recoverable: 230, recovered: 175 },
  ];

  const chartWidth = 580;
  const chartHeight = 180;
  const padX = 38;
  const padY = 22;
  const maxChartVal = 320;

  const getX = (idx: number) => padX + (idx / (months.length - 1)) * (chartWidth - 2 * padX);
  const getY = (val: number) => chartHeight - padY - (val / maxChartVal) * (chartHeight - 2 * padY);

  const createSmoothPath = (key: 'failed' | 'recoverable' | 'recovered') => {
    return performanceData.reduce((acc, pt, i, arr) => {
      const x = getX(i);
      const y = getY(pt[key]);
      if (i === 0) return `M ${x},${y}`;

      const prevX = getX(i - 1);
      const prevY = getY(arr[i - 1][key]);
      const cp1X = prevX + (x - prevX) / 2;
      const cp2X = cp1X;

      return `${acc} C ${cp1X},${prevY} ${cp2X},${y} ${x},${y}`;
    }, '');
  };

  const failedPath = createSmoothPath('failed');
  const recoverablePath = createSmoothPath('recoverable');
  const recoveredPath = createSmoothPath('recovered');
  const recoveredArea = `${recoveredPath} L ${getX(months.length - 1)},${chartHeight - padY} L ${getX(0)},${chartHeight - padY} Z`;

  const hoveredPoint = hoveredMonthIdx !== null ? performanceData[hoveredMonthIdx] : null;

  // Recovery Funnel Data
  const funnelSteps = [
    { label: 'Failed Revenue', val: '₹1.74M', sub: 'Total checkout decline volume', widthPct: 100, color: '#EF4444' },
    { label: 'Recoverable Revenue', val: '₹1.10M', sub: '63.2% recoverable via AI triage', widthPct: 76, color: '#F59E0B' },
    { label: 'Predicted Recovery', val: '₹620K', sub: 'High & Critical priority cohort', widthPct: 52, color: '#818CF8' },
    { label: 'Recovered Revenue', val: `₹${(revenueMetrics.revenueRecovered / 1000).toFixed(1)}K`, sub: `${revenueMetrics.recoveryRate.toFixed(1)}% captured into ledger`, widthPct: 38, color: '#10B981', isHighlight: true },
  ];

  // Failure Intelligence Data
  const failureIntelligence = [
    { label: 'Bank decline', pct: 48, revenue: '₹8.4L', count: '118 payments', color: '#F87171' },
    { label: 'Expired card', pct: 22, revenue: '₹3.8L', count: '54 payments', color: '#FBBF24' },
    { label: 'Insufficient funds', pct: 16, revenue: '₹2.8L', count: '39 payments', color: '#60A5FA' },
    { label: 'Authentication failure', pct: 8, revenue: '₹1.4L', count: '20 payments', color: '#34D399' },
    { label: 'Network issue', pct: 6, revenue: '₹1.0L', count: '15 payments', color: '#A78BFA' },
  ];

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {/* Header with Time Filters */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Revenue Analytics
          </h2>
          <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
            Measure recovery performance, conversion funnels, and failure intelligence across your payment data.
          </p>
        </div>

        {/* Time Filters: 7D, 30D, 90D, 12M */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#0C1017',
            border: '1px solid #1A2436',
            borderRadius: 'var(--radius-sm)',
            padding: '2px',
          }}
        >
          {(['7D', '30D', '90D', '12M'] as TimeRange[]).map((tr) => {
            const isActive = timeRange === tr;
            return (
              <button
                key={tr}
                onClick={() => setTimeRange(tr)}
                style={{
                  background: isActive ? '#10B981' : 'transparent',
                  color: isActive ? '#06150E' : '#94A3B8',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '4px 10px',
                  fontSize: '11.5px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 120ms ease',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {tr}
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
        }}
      >
        {[
          { label: 'Revenue Recovered', val: `₹${((revenueMetrics.revenueRecovered * timeMultiplier) / 1000).toFixed(1)}K`, change: '+24.6%', icon: TrendingUp, color: '#10B981' },
          { label: 'Recovery Rate', val: `${revenueMetrics.recoveryRate.toFixed(1)}%`, change: '+3.1%', icon: Target, color: '#38BDF8' },
          { label: 'Revenue at Risk', val: `₹${((revenueMetrics.revenueAtRisk * timeMultiplier) / 100000).toFixed(2)}M`, change: '+24.6%', icon: Shield, color: '#EF4444' },
          { label: 'Avg. Recovery', val: '₹8,420', change: '+14.2%', icon: AlertTriangle, color: '#F59E0B' },
        ].map((k) => {
          return (
            <div key={k.label} className="s22-card" style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>{k.label}</span>
                <span className="delta-pill-green">{k.change}</span>
              </div>
              <div
                className="font-mono"
                style={{ fontSize: '23px', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}
              >
                {k.val}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* PAYMENT RECOVERY FLOW (Connected Horizontal Stages with Live Data & Tooltips) */}
      {/* ========================================================================= */}
      <div className="s22-card" style={{ padding: '16px 18px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF' }}>
              Payment Recovery Flow
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
              Live autonomous conversion pipeline from failure ingestion to revenue recovered
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>Synchronized with Agent</span>
          </div>
        </div>

        {/* Connected Horizontal Flow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '2px',
          }}
        >
          {flowStages.map((stage, idx) => {
            const isHovered = hoveredStageIdx === idx;
            const isLast = idx === flowStages.length - 1;

            return (
              <React.Fragment key={stage.name}>
                {/* Stage Node */}
                <div
                  onMouseEnter={() => setHoveredStageIdx(idx)}
                  onMouseLeave={() => setHoveredStageIdx(null)}
                  style={{
                    flex: 1,
                    minWidth: '120px',
                    backgroundColor: '#070A0F',
                    border: isHovered ? `1.5px solid ${stage.color}` : '1px solid #161F2E',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    boxShadow: isHovered ? `0 0 12px ${stage.color}25` : 'none',
                    transition: 'all 150ms ease',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: stage.color, letterSpacing: '0.03em' }}>
                      {stage.name}
                    </span>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 600,
                        color: idx === 0 ? '#94A3B8' : '#34D399',
                      }}
                    >
                      {stage.pctOfPrev}
                    </span>
                  </div>

                  <div
                    className="font-mono"
                    style={{
                      fontSize: '21px',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      margin: '3px 0 1px',
                    }}
                  >
                    {stage.count}
                  </div>

                  <div style={{ fontSize: '10.5px', color: '#64748B' }}>
                    {stage.volume} volume
                  </div>
                </div>

                {/* Arrow connector between stages */}
                {!isLast && (
                  <div style={{ color: '#2B374D', display: 'flex', alignItems: 'center', padding: '0 2px' }}>
                    <ArrowRight size={13} color="#475569" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Detailed Hover Tooltip for Active Stage */}
        {hoveredStageIdx !== null && (
          <div
            style={{
              position: 'absolute',
              top: '68px',
              left: `${Math.min(85, Math.max(15, (hoveredStageIdx / (flowStages.length - 1)) * 100))}%`,
              transform: 'translateX(-50%)',
              backgroundColor: '#090D15',
              border: `1px solid ${flowStages[hoveredStageIdx].color}`,
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              boxShadow: '0 12px 24px rgba(0,0,0,0.8)',
              zIndex: 30,
              minWidth: '190px',
              pointerEvents: 'none',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', marginBottom: '3px' }}>
              {flowStages[hoveredStageIdx].name}
            </div>
            <div style={{ fontSize: '10.5px', color: '#94A3B8', marginBottom: '8px' }}>
              {flowStages[hoveredStageIdx].desc}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E2E8F0' }}>
                <span>Payments:</span>
                <span className="font-mono" style={{ fontWeight: 600 }}>{flowStages[hoveredStageIdx].count}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E2E8F0' }}>
                <span>Volume:</span>
                <span className="font-mono" style={{ fontWeight: 600 }}>{flowStages[hoveredStageIdx].volume}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34D399' }}>
                <span>Conversion:</span>
                <span className="font-mono" style={{ fontWeight: 600 }}>{flowStages[hoveredStageIdx].pctOfPrev}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                <span>Avg. Processing:</span>
                <span>{flowStages[hoveredStageIdx].avgTime}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN GRID: RECOVERY PERFORMANCE (LEFT) + RECOVERY FUNNEL (RIGHT) */}
      {/* ========================================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.85fr) minmax(290px, 1.15fr)',
          gap: '14px',
          alignItems: 'stretch',
        }}
      >
        {/* Left Column: Data-Driven Recovery Performance Chart */}
        <div className="s22-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF' }}>
                Recovery Performance
              </div>
              <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '1px' }}>
                Failed vs Recoverable vs Recovered payment revenue
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11.5px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#94A3B8' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                Failed
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#94A3B8' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                Recoverable
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#94A3B8' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                Recovered
              </span>
            </div>
          </div>

          {/* SVG Multi-Wave Curves with Hover Interaction */}
          <div style={{ position: 'relative', width: '100%', flex: 1, minHeight: '180px' }}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="analyticsRecoveredGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[300, 200, 100, 0].map((v) => {
                const y = getY(v);
                return (
                  <g key={v}>
                    <text x={padX - 7} y={y + 3} textAnchor="end" fill="#475569" fontSize="9">
                      ₹{v}K
                    </text>
                    <line x1={padX} y1={y} x2={chartWidth - padX} y2={y} stroke="#141B26" strokeWidth="1" strokeDasharray="3 3" />
                  </g>
                );
              })}

              {/* 1. Failed Revenue (Red curve) */}
              <path d={failedPath} fill="none" stroke="#EF4444" strokeWidth="1.8" />

              {/* 2. Recoverable Revenue (Amber curve) */}
              <path d={recoverablePath} fill="none" stroke="#F59E0B" strokeWidth="1.8" />

              {/* 3. Recovered Revenue (Green area + curve) */}
              <path d={recoveredArea} fill="url(#analyticsRecoveredGrad)" />
              <path d={recoveredPath} fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" />

              {/* Hover nodes & X-axis */}
              {months.map((m, i) => {
                const x = getX(i);
                const isHovered = hoveredMonthIdx === i;

                return (
                  <g key={m} onMouseEnter={() => setHoveredMonthIdx(i)} style={{ cursor: 'pointer' }}>
                    <rect x={x - 16} y={0} width={32} height={chartHeight} fill="transparent" />

                    {isHovered && (
                      <>
                        <line x1={x} y1={padY} x2={x} y2={chartHeight - padY} stroke="#10B981" strokeWidth="1" strokeDasharray="2 2" />
                        <circle cx={x} cy={getY(performanceData[i].recovered)} r={4} fill="#06080D" stroke="#10B981" strokeWidth="1.8" />
                        <circle cx={x} cy={getY(performanceData[i].recoverable)} r={3.5} fill="#06080D" stroke="#F59E0B" strokeWidth="1.4" />
                        <circle cx={x} cy={getY(performanceData[i].failed)} r={3.5} fill="#06080D" stroke="#EF4444" strokeWidth="1.4" />
                      </>
                    )}

                    <text x={x} y={chartHeight - 4} textAnchor="middle" fill={isHovered ? '#FFFFFF' : '#64748B'} fontSize="10">
                      {m}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip */}
            {hoveredPoint && hoveredMonthIdx !== null && (
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: `${(getX(hoveredMonthIdx) / chartWidth) * 100}%`,
                  transform: 'translateX(-50%)',
                  backgroundColor: '#090D15',
                  border: '1px solid #1A2436',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 10px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.8)',
                  pointerEvents: 'none',
                  zIndex: 10,
                  minWidth: '135px',
                }}
              >
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#FFFFFF', marginBottom: '3px' }}>
                  {hoveredPoint.month} 2025
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#EF4444' }}>
                  <span>Failed:</span>
                  <span className="font-mono">₹{hoveredPoint.failed}K</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#F59E0B' }}>
                  <span>Recoverable:</span>
                  <span className="font-mono">₹{hoveredPoint.recoverable}K</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#10B981', fontWeight: 600 }}>
                  <span>Recovered:</span>
                  <span className="font-mono">₹{hoveredPoint.recovered}K</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recovery Funnel */}
        <div className="s22-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF' }}>
              Recovery Funnel
            </div>
            <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '1px', marginBottom: '14px' }}>
              Capital salvage progression through AI decisioning
            </div>

            {/* Funnel Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {funnelSteps.map((step) => (
                <div key={step.label} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: step.isHighlight ? '#34D399' : '#CBD5E1', fontWeight: step.isHighlight ? 700 : 500 }}>
                      {step.label}
                    </span>
                    <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: step.isHighlight ? '#10B981' : '#FFFFFF' }}>
                      {step.val}
                    </span>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#070A0F',
                      border: '1px solid #161F2E',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${step.widthPct}%`,
                        height: '100%',
                        backgroundColor: step.color,
                        borderRadius: 'var(--radius-full)',
                        boxShadow: step.isHighlight ? '0 0 8px #10B981' : 'none',
                        transition: 'width 300ms ease',
                      }}
                    />
                  </div>

                  <div style={{ fontSize: '10.5px', color: '#64748B' }}>
                    {step.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Funnel Bottom Rationale */}
          <div
            style={{
              fontSize: '10.5px',
              color: '#64748B',
              borderTop: '1px solid #141B27',
              paddingTop: '10px',
              marginTop: '12px',
              lineHeight: 1.45,
            }}
          >
            ✓ Bayesian scoring halts permanent declines early to preserve payment gateway health and optimize conversion.
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FAILURE INTELLIGENCE SECTION */}
      {/* ========================================================================= */}
      <div className="s22-card" style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF' }}>
              Failure Intelligence
            </div>
            <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '1px' }}>
              Decline taxonomy, recovery potential, and revenue affected
            </div>
          </div>

          <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
            ● AI Taxonomy Active
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {failureIntelligence.map((fi) => (
            <div key={fi.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#F1F5F9', fontWeight: 500 }}>{fi.label}</span>
                  <span style={{ color: '#64748B', fontSize: '11px' }}>({fi.count})</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="font-mono" style={{ color: '#94A3B8' }}>{fi.revenue}</span>
                  <span className="font-mono" style={{ color: '#FFFFFF', fontWeight: 600 }}>{fi.pct}%</span>
                </div>
              </div>

              <div
                style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: '#070A0F',
                  border: '1px solid #161F2E',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${fi.pct}%`,
                    height: '100%',
                    backgroundColor: fi.color,
                    borderRadius: '2px',
                    transition: 'width 250ms ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
