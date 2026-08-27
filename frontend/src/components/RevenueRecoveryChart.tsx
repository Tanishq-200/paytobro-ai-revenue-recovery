import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useRecovery } from '../context/RecoveryContext.js';

export const RevenueRecoveryChart: React.FC = () => {
  const { revenueMetrics } = useRecovery();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(5); // default hover on Jun

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Wave data matching Screen 22 curves
  const revenuePoints = [25, 45, 30, 70, 95, 125, 140, 195, 160, 135, 105, 130];
  const recoveryPoints = [15, 30, 20, 50, 75, 98, 110, 160, 130, 110, 80, 100];

  const chartWidth = 620;
  const chartHeight = 175;
  const padX = 42;
  const padY = 18;

  const maxVal = 250;

  const getX = (idx: number) => padX + (idx / (months.length - 1)) * (chartWidth - 2 * padX);
  const getY = (val: number) => chartHeight - padY - (val / maxVal) * (chartHeight - 2 * padY);

  // Smooth Bezier path generator
  const createPath = (data: number[]) => {
    return data.reduce((acc, val, i, arr) => {
      const x = getX(i);
      const y = getY(val);
      if (i === 0) return `M ${x},${y}`;

      const prevX = getX(i - 1);
      const prevY = getY(arr[i - 1]);
      const cp1X = prevX + (x - prevX) / 2;
      const cp2X = cp1X;

      return `${acc} C ${cp1X},${prevY} ${cp2X},${y} ${x},${y}`;
    }, '');
  };

  const revenuePath = createPath(revenuePoints);
  const recoveryPath = createPath(recoveryPoints);
  const areaPath = `${revenuePath} L ${getX(months.length - 1)},${chartHeight - padY} L ${getX(0)},${chartHeight - padY} Z`;

  const recoveredK = (revenueMetrics.revenueRecovered / 1000).toFixed(1);

  return (
    <div className="s22-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}
      >
        <div>
          <div style={{ fontSize: '12.5px', color: '#94A3B8', fontWeight: 500 }}>
            Total Revenue Recovered
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px', marginTop: '2px' }}>
            <span
              className="font-mono"
              style={{ fontSize: '23px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}
            >
              ₹{recoveredK}K
            </span>
            <span className="delta-pill-green">
              + 24.6%
            </span>
          </div>
        </div>

        {/* Legend & Date Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11.5px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#94A3B8' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              Revenue
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#94A3B8' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FACC15' }} />
              Recovery
            </span>
          </div>

          {/* Date Selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: '#0E131C',
              border: '1px solid #1A2230',
              borderRadius: 'var(--radius-sm)',
              padding: '4px 8px',
              fontSize: '11px',
              color: '#94A3B8',
              cursor: 'pointer',
            }}
          >
            <span>Jan 2025 - Dec 2025</span>
            <ChevronDown size={12} color="#64748B" />
          </div>
        </div>
      </div>

      {/* Wave SVG Area */}
      <div style={{ position: 'relative', width: '100%', flex: 1, minHeight: '175px' }}>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="s22GreenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.32" />
              <stop offset="60%" stopColor="#10B981" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Y Axis Grid Lines & Labels */}
          {[250, 200, 150, 100, 50, 0].map((v) => {
            const y = getY(v);
            return (
              <g key={v}>
                <text
                  x={padX - 7}
                  y={y + 3}
                  textAnchor="end"
                  fill="#475569"
                  fontSize="9.5"
                  fontFamily="var(--font-sans)"
                >
                  {v === 0 ? '0K' : `${v}K`}
                </text>
                <line
                  x1={padX}
                  y1={y}
                  x2={chartWidth - padX}
                  y2={y}
                  stroke="#141B26"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#s22GreenGradient)" />

          {/* Primary Revenue Wave (Green) */}
          <path
            d={revenuePath}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Secondary Recovery Wave (Yellow / Lime) */}
          <path
            d={recoveryPath}
            fill="none"
            stroke="#FACC15"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="2 2"
          />

          {/* Nodes and X Axis */}
          {months.map((m, i) => {
            const x = getX(i);
            const y = getY(revenuePoints[i]);
            const isHovered = hoveredIdx === i;

            return (
              <g key={m} onMouseEnter={() => setHoveredIdx(i)} style={{ cursor: 'pointer' }}>
                <rect x={x - 16} y={0} width={32} height={chartHeight} fill="transparent" />

                {isHovered && (
                  <>
                    <line
                      x1={x}
                      y1={padY}
                      x2={x}
                      y2={chartHeight - padY}
                      stroke="#10B981"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r={4.5}
                      fill="#06080D"
                      stroke="#10B981"
                      strokeWidth="2"
                    />
                  </>
                )}

                <text
                  x={x}
                  y={chartHeight - 3}
                  textAnchor="middle"
                  fill={isHovered ? '#FFFFFF' : '#64748B'}
                  fontSize="10"
                  fontFamily="var(--font-sans)"
                >
                  {m}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredIdx !== null && (
          <div
            style={{
              position: 'absolute',
              top: '32px',
              left: `${(getX(hoveredIdx) / chartWidth) * 100}%`,
              transform: 'translateX(-50%)',
              backgroundColor: '#090D15',
              border: '1px solid #1A2436',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 9px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.8)',
              pointerEvents: 'none',
              zIndex: 10,
              minWidth: '105px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span className="font-mono" style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>
                ₹125.2K
              </span>
              <span className="delta-pill-green" style={{ padding: '1px 3px', fontSize: '9.5px' }}>
                + 12.5%
              </span>
            </div>
            <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>
              Jun 21, 2025
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
