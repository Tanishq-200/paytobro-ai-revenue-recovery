import React from 'react';
import { Download, RefreshCw, RotateCcw } from 'lucide-react';
import { useRecovery } from '../context/RecoveryContext.js';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Welcome back, Tanishq',
  subtitle = 'Measure and recover revenue lost from failed payments',
}) => {
  const { isSimulating, runSimulation, resetDemo } = useRecovery();

  const handleReset = () => {
    if (window.confirm('Reset all demo recovery data, pipeline counters, and activity feed to baseline?')) {
      resetDemo();
    }
  };

  return (
    <header
      style={{
        height: 'var(--header-height)',
        minHeight: 'var(--header-height)',
        backgroundColor: 'var(--bg-app)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Title & Subtitle */}
      <div>
        <h1
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '1px' }}>
          {subtitle}
        </p>
      </div>

      {/* Top-Right Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Reset Demo Button */}
        <button
          onClick={handleReset}
          className="btn-dark-outline"
          title="Reset demo data to baseline"
        >
          <RotateCcw size={12} color="#94A3B8" />
          <span>Reset Demo</span>
        </button>

        {/* Export Data */}
        <button
          onClick={() => alert('Exporting payment recovery ledger to CSV...')}
          className="btn-dark-outline"
        >
          <Download size={12} color="#94A3B8" />
          <span>Export Data</span>
        </button>

        {/* Run Recovery Simulation */}
        <button
          onClick={runSimulation}
          disabled={isSimulating}
          className="btn-emerald"
        >
          <RefreshCw size={12} className={isSimulating ? 'animate-spin' : ''} />
          <span>{isSimulating ? 'Simulating Pipeline...' : 'Run Recovery Simulation'}</span>
        </button>
      </div>
    </header>
  );
};
