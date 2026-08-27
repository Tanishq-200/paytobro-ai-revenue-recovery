import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { useRecovery } from '../context/RecoveryContext.js';

interface CaseDetailModalProps {
  caseOrTxId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  caseOrTxId,
  isOpen,
  onClose,
}) => {
  const { cases, executeRecovery } = useRecovery();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  if (!isOpen || !caseOrTxId) return null;

  const targetCase = cases.find((c) => c.txId === caseOrTxId || c.id === caseOrTxId) || cases[0];
  const isRecovered = targetCase.status === 'Recovered';

  const handleContinueConfirm = async () => {
    setIsExecuting(true);
    try {
      await executeRecovery(targetCase.txId);
      setShowConfirm(false);
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '820px',
          padding: '24px',
          backgroundColor: '#070A0F',
          border: '1px solid #1E273A',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '18px',
            top: '18px',
            background: 'none',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
          }}
        >
          <X size={16} />
        </button>

        {/* Screen 58 Confirmation Modal Overlay */}
        {showConfirm && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#070A0F',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 30,
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
              Recovery Action Confirmation
            </h3>
            <p style={{ fontSize: '12.5px', color: '#94A3B8', marginBottom: '20px' }}>
              Confirm recovery action for <span className="font-mono" style={{ color: '#FFFFFF' }}>{targetCase.txId}</span>?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowConfirm(false)}
                className="btn-dark-outline"
                style={{ padding: '7px 18px' }}
              >
                Cancel
              </button>
              <button
                onClick={handleContinueConfirm}
                disabled={isExecuting}
                className="btn-emerald"
                style={{ padding: '7px 22px' }}
              >
                {isExecuting ? 'Processing...' : 'Continue'}
              </button>
            </div>
          </div>
        )}

        {/* Screen 59 Success Modal Overlay */}
        {showSuccess && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#070A0F',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 30,
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
              Recovery Success
            </h3>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#10B981', marginBottom: '20px' }}>
              ₹{targetCase.amount.toLocaleString('en-IN')} successfully recovered
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  onClose();
                }}
                className="btn-emerald"
                style={{ padding: '7px 24px' }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Screen 24 Header */}
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Recovery Case Details
          </h2>
          <p style={{ fontSize: '12.5px', color: '#94A3B8', marginTop: '2px' }}>
            Payment #{targetCase.txId} • ₹{targetCase.amount.toLocaleString('en-IN')} • {targetCase.failureType}
          </p>
        </div>

        {/* Screen 24 Top 3 Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          {/* Card 1 */}
          <div className="s22-card" style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Recovery Probability</span>
              <span className="delta-pill-green">+24.6%</span>
            </div>
            <div className="font-mono" style={{ fontSize: '23px', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>
              {targetCase.recoveryProbability}%
            </div>
          </div>

          {/* Card 2 */}
          <div className="s22-card" style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Potential Recovery</span>
              <span className="delta-pill-green">+24.6%</span>
            </div>
            <div className="font-mono" style={{ fontSize: '23px', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>
              ₹{targetCase.potentialRecovery.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Card 3 */}
          <div className="s22-card" style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Attempts</span>
              <span className="delta-pill-green">+24.6%</span>
            </div>
            <div className="font-mono" style={{ fontSize: '23px', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>
              {targetCase.attempts} / {targetCase.maxAttempts}
            </div>
          </div>
        </div>

        {/* Screen 24 Two Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '14px',
          }}
        >
          {/* Left Column: AI Recovery Decision */}
          <div
            className="s22-card"
            style={{
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '230px',
            }}
          >
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '10px' }}>
                AI Recovery Decision
              </div>

              <div style={{ fontSize: '15px', fontWeight: 700, color: '#10B981', marginBottom: '14px' }}>
                {targetCase.recommendedAction}
              </div>

              <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500, marginBottom: '4px' }}>
                Why this decision?
              </div>

              <p style={{ fontSize: '12.5px', color: '#CBD5E1', lineHeight: 1.5 }}>
                {targetCase.failureType === 'Temporary bank failure'
                  ? 'Temporary issuer decline + strong customer reliability.'
                  : targetCase.failureType === 'Expired card'
                  ? 'Card expiration detected; 1-click alternative method routing avoids decline.'
                  : 'Customer balance low; staggered morning reminder yields high win rate.'}
              </p>
            </div>

            <div style={{ marginTop: '16px' }}>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={isRecovered || isExecuting}
                className="btn-emerald"
                style={{ width: 'auto', padding: '7px 18px' }}
              >
                {isRecovered ? '✓ Payment Recovered' : 'Execute Simulation'}
              </button>
            </div>
          </div>

          {/* Right Column: Payment Timeline */}
          <div className="s22-card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '14px' }}>
              Payment Timeline
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {targetCase.timeline.map((step, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#10B981',
                      marginTop: '3.5px',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: 500, color: '#FFFFFF' }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      {step.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
