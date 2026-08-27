import React from 'react';
import { ArrowRight, Cpu, ShieldCheck, Sparkles, TrendingUp, CheckCircle } from 'lucide-react';
import { Logo } from './Logo.js';

interface LandingHeroProps {
  onOpenDashboard: () => void;
  onExploreAgent: () => void;
  onClose?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onOpenDashboard,
  onExploreAgent,
  onClose,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#050811',
        zIndex: 100,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Navbar */}
      <header
        style={{
          padding: '20px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #141C30',
        }}
      >
        <Logo size="md" />

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span
            style={{
              fontSize: '11px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#10B981',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span className="status-dot status-dot-green animate-pulse-subtle" />
            Fintech AI Buildathon Edition
          </span>

          <button onClick={onOpenDashboard} className="btn btn-primary btn-sm">
            <span>Enter Platform</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
          maxWidth: '1100px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {/* Badge Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#818CF8',
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '24px',
          }}
        >
          <Sparkles size={14} color="#818CF8" />
          <span>Autonomous Payment Failure Recovery Engine</span>
        </div>

        {/* Hero Title */}
        <h1
          style={{
            fontSize: '56px',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: '#FFFFFF',
            lineHeight: 1.08,
            marginBottom: '20px',
            maxWidth: '820px',
          }}
        >
          Recover Every <span style={{ color: '#6366F1' }}>Possible</span> Payment.
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '18px',
            color: '#94A3B8',
            maxWidth: '680px',
            lineHeight: 1.5,
            marginBottom: '36px',
          }}
        >
          PayToBro uses AI to detect payment failures, choose the right recovery strategy, and turn lost revenue into recovered revenue.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '56px' }}>
          <button
            onClick={onOpenDashboard}
            className="btn btn-primary"
            style={{ padding: '12px 26px', fontSize: '15px', borderRadius: 'var(--radius-sm)' }}
          >
            <span>Open Recovery Dashboard</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={onExploreAgent}
            className="btn btn-secondary"
            style={{ padding: '12px 24px', fontSize: '15px', borderRadius: 'var(--radius-sm)' }}
          >
            <Cpu size={16} color="#818CF8" />
            <span>Explore AI Agent</span>
          </button>
        </div>

        {/* The Visual 8-Step Core Flow Diagram */}
        <div
          style={{
            width: '100%',
            backgroundColor: '#0B1120',
            border: '1px solid #1E293B',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 20px',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.7)',
          }}
        >
          <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '16px' }}>
            The Core Autonomous Flow
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            {[
              { label: 'Payment Failed', color: '#EF4444' },
              { label: 'AI Analyzes', color: '#6366F1' },
              { label: 'Failure Classified', color: '#8B5CF6' },
              { label: 'Probability Predicted', color: '#06B6D4' },
              { label: 'Best Action Selected', color: '#F59E0B' },
              { label: 'Recovery Executed', color: '#10B981' },
              { label: 'Outcome Measured', color: '#3B82F6' },
              { label: 'Revenue Recovered', color: '#34D399', isProminent: true },
            ].map((step, idx, arr) => (
              <React.Fragment key={idx}>
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: step.isProminent ? 'rgba(16, 185, 129, 0.15)' : '#111827',
                    border: step.isProminent ? '1px solid #10B981' : '1px solid #1E293B',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: step.color,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {step.isProminent && <CheckCircle size={12} color="#10B981" />}
                  <span>{step.label}</span>
                </div>
                {idx < arr.length - 1 && (
                  <span style={{ color: '#475569', fontSize: '12px' }}>→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </main>

      {/* Footer / Safety Badge */}
      <footer
        style={{
          padding: '16px 48px',
          borderTop: '1px solid #141C30',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#64748B',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="#10B981" />
          <span>Simulated fintech sandbox environment. No real bank credentials or card numbers stored.</span>
        </div>

        <div>
          PayToBro © 2026 • AI Revenue Recovery
        </div>
      </footer>
    </div>
  );
};
