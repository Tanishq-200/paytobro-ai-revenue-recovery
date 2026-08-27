import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';

interface ChartPoint {
  date: string;
  failed: number;
  recoverable: number;
  recovered: number;
  rate: number;
}

interface RecoveryChartProps {
  series7D?: ChartPoint[];
  series30D?: ChartPoint[];
  series90D?: ChartPoint[];
}

export const RecoveryChart: React.FC<RecoveryChartProps> = ({
  series7D = [],
  series30D = [],
  series90D = [],
}) => {
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D'>('7D');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const activeSeries =
    timeframe === '7D'
      ? series7D.length > 0 ? series7D : [
          { date: 'Mon', failed: 180000, recoverable: 120000, recovered: 45000, rate: 25.0 },
          { date: 'Tue', failed: 220000, recoverable: 145000, recovered: 68000, rate: 30.9 },
          { date: 'Wed', failed: 160000, recoverable: 110000, recovered: 52000, rate: 32.5 },
          { date: 'Thu', failed: 280000, recoverable: 190000, recovered: 89000, rate: 31.8 },
          { date: 'Fri', failed: 240000, recoverable: 160000, recovered: 98000, rate: 40.8 },
          { date: 'Sat', failed: 190000, recoverable: 130000, recovered: 82000, rate: 43.1 },
          { date: 'Sun', failed: 210000, recoverable: 140000, recovered: 92000, rate: 43.8 },
        ]
      : timeframe === '30D'
      ? series30D.length > 0 ? series30D : [
          { date: 'Week 1', failed: 850000, recoverable: 560000, recovered: 210000, rate: 24.7 },
          { date: 'Week 2', failed: 920000, recoverable: 610000, recovered: 290000, rate: 31.5 },
          { date: 'Week 3', failed: 1040000, recoverable: 690000, recovered: 350000, rate: 33.6 },
          { date: 'Week 4', failed: 1240000, recoverable: 780000, recovered: 511000, rate: 41.2 },
        ]
      : series90D.length > 0 ? series90D : [
          { date: 'Month 1', failed: 2800000, recoverable: 1750000, recovered: 680000, rate: 24.2 },
          { date: 'Month 2', failed: 3400000, recoverable: 2200000, recovered: 1120000, rate: 32.9 },
          { date: 'Month 3', failed: 3950000, recoverable: 2650000, recovered: 1630000, rate: 41.2 },
        ];

  // Compute scale
  const maxVal = Math.max(...activeSeries.map((d) => Math.max(d.failed, d.recoverable, d.recovered)), 100000);
  const chartHeight = 220;
  const chartWidth = 600;
  const paddingX = 40;
  const paddingY = 20;

  const getX = (index: number) => {
    if (activeSeries.length <= 1) return chartWidth / 2;
    return paddingX + (index / (activeSeries.length - 1)) * (chartWidth - 2 * paddingX);
  };

  const getY = (val: number) => {
    const usableHeight = chartHeight - 2 * paddingY;
    return chartHeight - paddingY - (val / (maxVal * 1.1)) * usableHeight;
  };

  const buildPath = (key: 'failed' | 'recoverable' | 'recovered') => {
    if (activeSeries.length === 0) return '';
    return activeSeries.reduce((acc, point, i) => {
      const x = getX(i);
      const y = getY(point[key]);
      return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  };

  const failedPath = buildPath('failed');
  const recoverablePath = buildPath('recoverable');
  const recoveredPath = buildPath('recovered');

  const hoveredPoint = hoveredIdx !== null ? activeSeries[hoveredIdx] : null;

  return (
    <div className="card" style={{ padding: '24px', height: '100%' }}>
      {/* Chart Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={16} color="#10B981" />
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Recovered Revenue Performance
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Tracking failed, recoverable, and autonomously salvaged revenue.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {(['7D', '30D', '90D'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              style={{
                background: timeframe === t ? 'var(--bg-surface-active)' : 'transparent',
                border: timeframe === t ? '1px solid var(--primary-light)' : '1px solid var(--border-subtle)',
                color: timeframe === t ? '#FFFFFF' : 'var(--text-secondary)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          marginBottom: '16px',
          fontSize: '12px',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#EF4444' }} />
          Failed Revenue
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#6366F1' }} />
          Recoverable Revenue
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#10B981', boxShadow: '0 0 6px #10B981' }} />
          Revenue Recovered
        </span>
      </div>

      {/* Chart SVG */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          style={{ width: '100%', height: '240px', overflow: 'visible' }}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1.0].map((ratio) => {
            const y = chartHeight - paddingY - ratio * (chartHeight - 2 * paddingY);
            return (
              <line
                key={ratio}
                x1={paddingX}
                y1={y}
                x2={chartWidth - paddingX}
                y2={y}
                stroke="#1E293B"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* Failed Path */}
          <path
            d={failedPath}
            fill="none"
            stroke="#EF4444"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.75"
          />

          {/* Recoverable Path */}
          <path
            d={recoverablePath}
            fill="none"
            stroke="#6366F1"
            strokeWidth="2"
            opacity="0.85"
          />

          {/* Recovered Path (Prominent) */}
          <path
            d={recoveredPath}
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            filter="drop-shadow(0 0 6px rgba(16, 185, 129, 0.45))"
          />

          {/* Interactive Hover Nodes */}
          {activeSeries.map((point, i) => {
            const x = getX(i);
            const yRecovered = getY(point.recovered);
            const isHovered = hoveredIdx === i;

            return (
              <g key={i} onMouseEnter={() => setHoveredIdx(i)} style={{ cursor: 'pointer' }}>
                {/* Hit target */}
                <rect
                  x={x - 18}
                  y={0}
                  width={36}
                  height={chartHeight}
                  fill="transparent"
                />

                {/* Vertical hover line */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={paddingY}
                    x2={x}
                    y2={chartHeight - paddingY}
                    stroke="#818CF8"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Node circle */}
                <circle
                  cx={x}
                  cy={yRecovered}
                  r={isHovered ? 6 : 4}
                  fill="#0E1526"
                  stroke="#10B981"
                  strokeWidth="2.5"
                />

                {/* X Axis Label */}
                <text
                  x={x}
                  y={chartHeight - 4}
                  textAnchor="middle"
                  fill={isHovered ? '#FFFFFF' : '#64748B'}
                  fontSize="11"
                  fontFamily="var(--font-sans)"
                >
                  {point.date}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && hoveredIdx !== null && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: `${Math.min(80, Math.max(10, (hoveredIdx / (activeSeries.length - 1)) * 100))}%`,
              transform: 'translateX(-50%)',
              backgroundColor: '#0F172A',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 30,
              pointerEvents: 'none',
              minWidth: '180px',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
              {hoveredPoint.date} Diagnostics
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#EF4444' }}>
                <span>Failed:</span>
                <span className="font-mono">₹{hoveredPoint.failed.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#818CF8' }}>
                <span>Recoverable:</span>
                <span className="font-mono">₹{hoveredPoint.recoverable.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: 600 }}>
                <span>Recovered:</span>
                <span className="font-mono">₹{hoveredPoint.recovered.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', paddingTop: '4px', borderTop: '1px solid var(--border-subtle)' }}>
                <span>Recovery Rate:</span>
                <span className="font-mono" style={{ color: '#38BDF8', fontWeight: 600 }}>{hoveredPoint.rate}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
