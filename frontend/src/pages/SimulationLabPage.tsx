import React, { useState } from 'react';
import { executeSimulation } from '../services/api.js';

interface SimulationLabPageProps {
  onMetricsUpdated?: () => void;
}

export const SimulationLabPage: React.FC<SimulationLabPageProps> = ({ onMetricsUpdated }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [recoveredCount, setRecoveredCount] = useState(381);
  const [recoveredAmount, setRecoveredAmount] = useState('₹3.96L');

  const handleRunSimulation = async () => {
    setIsRunning(true);
    try {
      await executeSimulation();
      setRecoveredCount((prev) => prev + 24);
      setRecoveredAmount('₹4.28L');
      onMetricsUpdated?.();
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Simulation Lab
        </h2>
        <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
          Safe synthetic payment recovery simulations and load stress testing.
        </p>
      </div>

      {/* Screen 40 Main Card */}
      <div className="s22-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
            Simulation Execution Sandbox
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
            Generate and run a synthetic recovery cohort across payment processors.
          </div>
        </div>

        {/* Screen 40 4 KPI Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
          }}
        >
          {[
            { label: 'Transactions', val: '1,000' },
            { label: 'Revenue at Risk', val: '₹10.4L' },
            { label: 'Potential Recovery', val: '₹4.82L' },
            { label: 'Recovered', val: recoveredAmount },
          ].map((k) => (
            <div key={k.label} className="s22-card" style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>{k.label}</div>
              <div className="font-mono" style={{ fontSize: '23px', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>
                {k.val}
              </div>
            </div>
          ))}
        </div>

        {/* Screen 40 Two Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '14px',
          }}
        >
          {/* Left Column: Pipeline Stages */}
          <div className="s22-card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '14px' }}>
              Simulation Pipeline
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { stage: 'Generated failed payments', count: 1000 },
                { stage: 'AI analyzed', count: 942 },
                { stage: 'Failures classified', count: 812 },
                { stage: 'Recovery predicted', count: 704 },
                { stage: 'Simulated recovery executed', count: recoveredCount },
              ].map((s) => (
                <div key={s.stage} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: '#CBD5E1' }}>{s.stage}</span>
                  <span className="font-mono" style={{ fontWeight: 600, color: '#10B981' }}>{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Wave Chart + Run Button */}
          <div className="s22-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '12px' }}>
                Simulation Result
              </div>

              {/* Synthetic Wave */}
              <div style={{ height: '100px' }}>
                <svg viewBox="0 0 300 80" style={{ width: '100%', height: '100%' }}>
                  <path
                    d="M 0,70 Q 50,40 100,55 T 200,25 T 300,10"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.2"
                  />
                  <circle cx="300" cy="10" r="4" fill="#06080D" stroke="#10B981" strokeWidth="1.8" />
                </svg>
              </div>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isRunning}
              className="btn-emerald"
              style={{ width: 'auto', alignSelf: 'flex-start', padding: '7px 18px' }}
            >
              {isRunning ? 'Running Simulation...' : 'Run Simulation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
