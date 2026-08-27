import React, { useState } from 'react';
import { useRecovery } from '../context/RecoveryContext.js';

interface SettingsPageProps {
  onDataReset?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onDataReset }) => {
  const { resetDemo } = useRecovery();
  const [accountName, setAccountName] = useState('Tanishq K.');
  const [email, setEmail] = useState('demo@paytobro.ai');
  const [integrationStatus, setIntegrationStatus] = useState('Connected');
  const [mode, setMode] = useState('Demo / Sandbox');
  const [notifications, setNotifications] = useState('Enabled');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo environment data back to baseline?')) {
      resetDemo();
      onDataReset?.();
      alert('Demo environment reset successfully.');
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Account Settings
        </h2>
        <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
          Manage your organization profile, gateway integration, and autonomous recovery rules.
        </p>
      </div>

      {/* Screen 66 Main Form Card */}
      <div className="s22-card" style={{ padding: '22px', maxWidth: '760px' }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '18px' }}>
          Account Profile & Integration
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Account name */}
          <div>
            <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '5px', fontWeight: 500 }}>
              Account name
            </label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#070A0F',
                border: '1px solid #182233',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                fontSize: '12.5px',
                color: '#FFFFFF',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
              }}
            />
          </div>

          {/* Email address */}
          <div>
            <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '5px', fontWeight: 500 }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#070A0F',
                border: '1px solid #182233',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                fontSize: '12.5px',
                color: '#FFFFFF',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
              }}
            />
          </div>

          {/* Integration Status */}
          <div>
            <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '5px', fontWeight: 500 }}>
              Integration status
            </label>
            <div
              style={{
                width: '100%',
                backgroundColor: '#070A0F',
                border: '1px solid #182233',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                fontSize: '12.5px',
                color: '#10B981',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span>Razorpay — Connected (Live Webhook Ingestion)</span>
            </div>
          </div>

          {/* Mode */}
          <div>
            <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '5px', fontWeight: 500 }}>
              Operating Mode
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#070A0F',
                border: '1px solid #182233',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                fontSize: '12.5px',
                color: '#FFFFFF',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <option value="Demo / Sandbox">Demo / Sandbox (Simulated autonomous retries)</option>
              <option value="Production (Autonomous)">Production (Autonomous execution enabled)</option>
              <option value="Shadow / Passive">Shadow / Passive (Recommendations only)</option>
            </select>
          </div>

          {/* Save Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
            <button type="submit" className="btn-emerald" style={{ padding: '7px 20px' }}>
              Save Changes
            </button>

            {savedMsg && (
              <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 500 }}>
                ✓ Settings saved successfully
              </span>
            )}
          </div>
        </form>

        {/* Demo Reset Section */}
        <div style={{ borderTop: '1px solid #141B27', marginTop: '22px', paddingTop: '18px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#EF4444', marginBottom: '4px' }}>
            Reset Demo Environment
          </div>
          <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '12px' }}>
            Restores all payment transactions, simulated logs, and Bayesian weights back to factory defaults.
          </p>
          <button
            onClick={handleReset}
            className="btn-dark-outline"
            style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#F87171' }}
          >
            Reset All Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};
