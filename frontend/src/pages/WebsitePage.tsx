import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Shield, Zap, RefreshCw, BarChart, Bot } from 'lucide-react';

interface WebsitePageProps {
  onGoToDashboard: () => void;
}

export const WebsitePage: React.FC<WebsitePageProps> = ({ onGoToDashboard }) => {
  const [activeSection, setActiveSection] = useState<'home' | 'login' | 'signup'>('home');

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#06080D',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Screen 2 Navbar / Header */}
      <header
        style={{
          height: '56px',
          borderBottom: '1px solid #141B27',
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          backgroundColor: '#06080D',
          zIndex: 50,
        }}
      >
        {/* Brand */}
        <div style={{ cursor: 'pointer' }} onClick={() => setActiveSection('home')}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.04em' }}>
            PAYTOBRO
          </div>
          <div style={{ fontSize: '9.5px', color: '#10B981', fontWeight: 700, letterSpacing: '0.06em' }}>
            AI REVENUE RECOVERY
          </div>
        </div>

        {/* Center Nav Links from Screen 1-15 */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '26px', fontSize: '12.5px', color: '#94A3B8' }}>
          <a href="#product" style={{ color: 'inherit', textDecoration: 'none' }}>Product</a>
          <a href="#how-it-works" style={{ color: 'inherit', textDecoration: 'none' }}>How it works</a>
          <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a>
          <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a>
          <a href="#docs" style={{ color: 'inherit', textDecoration: 'none' }}>Docs</a>
        </nav>

        {/* Right CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onGoToDashboard}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #10B981',
              color: '#34D399',
              padding: '6px 15px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Auth Screen 16: Login Modal Overlay */}
      {activeSection === 'login' && (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
          }}
        >
          <div className="s22-card" style={{ maxWidth: '420px', width: '100%', padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>PAYTOBRO</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginBottom: '20px' }}>Login</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '5px' }}>Email address</label>
                <input type="email" placeholder="Enter email address..." defaultValue="demo@paytobro.ai" style={{ width: '100%', backgroundColor: '#070A0F', border: '1px solid #182233', borderRadius: '4px', padding: '8px 12px', color: '#FFFFFF', fontSize: '12.5px' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '5px' }}>Password</label>
                <input type="password" placeholder="Enter password..." defaultValue="••••••••" style={{ width: '100%', backgroundColor: '#070A0F', border: '1px solid #182233', borderRadius: '4px', padding: '8px 12px', color: '#FFFFFF', fontSize: '12.5px' }} />
              </div>
              <button onClick={onGoToDashboard} className="btn-emerald" style={{ padding: '8px', marginTop: '6px' }}>
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen 1 / Screen 3 Hero Section */}
      {activeSection === 'home' && (
        <main style={{ flex: 1, padding: '44px 28px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: '38px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px', letterSpacing: '-0.02em' }}>
              Landing / Home
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '20px' }}>
              AI-powered revenue recovery for modern payment teams.
            </p>

            <h2 style={{ fontSize: '23px', fontWeight: 800, color: '#10B981', marginBottom: '18px' }}>
              Recover Every Possible Payment with AI.
            </h2>

            <button
              onClick={onGoToDashboard}
              className="btn-emerald"
              style={{ padding: '8px 20px', fontSize: '12.5px' }}
            >
              Start Recovering
            </button>
          </div>

          {/* Screen 1 Three Primary Feature Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '18px',
              marginBottom: '56px',
            }}
          >
            {[
              { title: 'Detect failures', desc: 'Real-time telemetry ingestion classifies bank declines, timeouts, expired instruments, and insufficient funds instantly.' },
              { title: 'Choose recovery action', desc: 'Deterministic Bayesian engine scores probability and executes autonomous cool-down retries or alternative rails.' },
              { title: 'Measure revenue', desc: 'Accurately quantifies salvage value, recovery rates, and merchant ledger credits with verifiable audit trails.' },
            ].map((card, i) => (
              <div
                key={i}
                className="s22-card"
                style={{
                  padding: '22px',
                  minHeight: '175px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
                  {card.title}
                </div>
                <div style={{ fontSize: '12.5px', color: '#94A3B8', lineHeight: 1.5 }}>
                  {card.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Screen 4 How It Works */}
          <section id="how-it-works" style={{ marginBottom: '56px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>How It Works</h2>
            <p style={{ fontSize: '12.5px', color: '#94A3B8', marginBottom: '20px' }}>
              Payment Failed → AI Analyzes → Failure Classified → Recovery Probability Predicted → Best Action Selected → Recovery Executed → Outcome Measured → Revenue Recovered.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div className="s22-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#10B981', marginBottom: '6px' }}>1. Real-time Ingestion</div>
                <p style={{ fontSize: '12.5px', color: '#94A3B8', lineHeight: 1.45 }}>Listens to payment webhook failures across UPI, Cards, NetBanking, and Wallets.</p>
              </div>
              <div className="s22-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#38BDF8', marginBottom: '6px' }}>2. Bayesian Heuristics</div>
                <p style={{ fontSize: '12.5px', color: '#94A3B8', lineHeight: 1.45 }}>Evaluates bank downtime windows, retry history, customer reliability, and ticket size.</p>
              </div>
              <div className="s22-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#F59E0B', marginBottom: '6px' }}>3. Optimal Recovery</div>
                <p style={{ fontSize: '12.5px', color: '#94A3B8', lineHeight: 1.45 }}>Triggers delayed retries, smart reminders, or 1-click alternative rails with strict guardrails.</p>
              </div>
            </div>
          </section>

          {/* Screen 10 Pricing */}
          <section id="pricing" style={{ marginBottom: '56px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>Pricing</h2>
            <p style={{ fontSize: '12.5px', color: '#94A3B8', marginBottom: '20px' }}>
              Pay only for the revenue we successfully recover. Zero risk.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div className="s22-card" style={{ padding: '22px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>Starter</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#10B981', margin: '6px 0' }}>₹0 / mo</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '16px' }}>5% fee on recovered volume</div>
                <button onClick={onGoToDashboard} className="btn-dark-outline" style={{ width: '100%' }}>Launch Demo</button>
              </div>
              <div className="s22-card" style={{ padding: '22px', border: '1px solid #10B981' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>Growth</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#10B981', margin: '6px 0' }}>₹14,999 / mo</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '16px' }}>3% fee on recovered volume</div>
                <button onClick={onGoToDashboard} className="btn-emerald" style={{ width: '100%' }}>Get Started</button>
              </div>
              <div className="s22-card" style={{ padding: '22px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>Enterprise</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#10B981', margin: '6px 0' }}>Custom</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '16px' }}>Custom SLA and dedicated AI agent</div>
                <button onClick={onGoToDashboard} className="btn-dark-outline" style={{ width: '100%' }}>Contact Sales</button>
              </div>
            </div>
          </section>

          {/* Screen 14 Footer */}
          <footer style={{ borderTop: '1px solid #141B27', paddingTop: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748B' }}>
            <div>© 2026 PayToBro AI Inc. Recover Every Possible Payment.</div>
            <button onClick={onGoToDashboard} className="btn-emerald" style={{ padding: '5px 14px', fontSize: '11.5px' }}>
              Open Master Dashboard (Screen 22) →
            </button>
          </footer>
        </main>
      )}
    </div>
  );
};
