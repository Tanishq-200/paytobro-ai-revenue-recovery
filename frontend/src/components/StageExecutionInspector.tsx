import React from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  Check,
  RefreshCw,
  Play,
  RotateCcw,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { DemoCase, PipelineStage } from '../context/RecoveryContext.js';

interface StageExecutionInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentStage: PipelineStage;
  onSelectStage: (stage: PipelineStage) => void;
  selectedCase: DemoCase;
  isSimulating: boolean;
  activeSimulationStage: PipelineStage;
  onExecuteRecovery: () => Promise<void>;
  isExecutingRecovery: boolean;
}

export const StageExecutionInspector: React.FC<StageExecutionInspectorProps> = ({
  isOpen,
  onClose,
  currentStage,
  onSelectStage,
  selectedCase,
  isSimulating,
  activeSimulationStage,
  onExecuteRecovery,
  isExecutingRecovery,
}) => {
  if (!isOpen || !currentStage) return null;

  const stagesList: Array<{ id: PipelineStage; label: string; number: number; color: string }> = [
    { id: 'PAYMENT FAILED', label: '1. Payment Failed', number: 1, color: '#EF4444' },
    { id: 'ANALYZING', label: '2. Analyzing', number: 2, color: '#38BDF8' },
    { id: 'CLASSIFYING', label: '3. Classifying', number: 3, color: '#818CF8' },
    { id: 'PREDICTING', label: '4. Predicting', number: 4, color: '#A855F7' },
    { id: 'RECOVERING', label: '5. Recovering', number: 5, color: '#F59E0B' },
    { id: 'MEASURED', label: '6. Measured', number: 6, color: '#10B981' },
  ];

  const currentStageIdx = stagesList.findIndex((s) => s.id === currentStage);
  const activeSimIdx = stagesList.findIndex((s) => s.id === activeSimulationStage);

  const isCurrentStageProcessing = isSimulating && activeSimulationStage === currentStage;
  const isRecovered = selectedCase.status === 'Recovered';

  const potentialRecoveryFormatted = `₹${selectedCase.potentialRecovery.toLocaleString('en-IN')}`;
  const amountFormatted = `₹${selectedCase.amount.toLocaleString('en-IN')}`;

  // Rationale based on failure type
  const getExplanation = () => {
    switch (selectedCase.failureType) {
      case 'Expired card':
        return 'The AI classified this as an instrument expiration because card validity date is expired. Gateway returned expired card decline.';
      case 'Insufficient funds':
        return 'The AI classified this as insufficient balance based on bank decline code 51 with normal account standing.';
      case 'Network issue':
        return 'The AI classified this as a transient network timeout because the TCP handshake timed out before issuer response.';
      default:
        return 'The AI classified this as a temporary failure because the gateway response indicates a transient bank-side decline.';
    }
  };

  // Gateway error code
  const getGatewayCode = () => {
    switch (selectedCase.failureType) {
      case 'Expired card':
        return 'CARD_EXPIRED_DECLINE';
      case 'Insufficient funds':
        return 'INSUFFICIENT_FUNDS_DECLINE';
      case 'Network issue':
        return 'GATEWAY_TIMEOUT_504';
      default:
        return 'TEMPORARY_DECLINE';
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 0,
        backgroundColor: 'rgba(3, 5, 10, 0.75)',
        backdropFilter: 'blur(5px)',
      }}
    >
      <div
        className="s22-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '580px',
          height: '100vh',
          borderRadius: 0,
          borderLeft: '1px solid #1C2638',
          borderRight: 'none',
          borderTop: 'none',
          borderBottom: 'none',
          backgroundColor: '#070A10',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-12px 0 36px rgba(0, 0, 0, 0.85)',
          overflow: 'hidden',
          animation: 'slideInRight 220ms ease-out',
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #141C2A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#090D15',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10B981',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              {currentStageIdx + 1}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                AI Execution Inspector
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                Stage {currentStageIdx + 1} of 6 — <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{currentStage}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isCurrentStageProcessing && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '10.5px',
                  color: '#38BDF8',
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid #38BDF8',
                  borderRadius: 'var(--radius-full)',
                  padding: '2px 8px',
                  fontWeight: 600,
                }}
              >
                <span className="animate-pulse" style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#38BDF8' }} />
                Processing...
              </span>
            )}

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Horizontal Stage Stepper Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '8px 16px',
            backgroundColor: '#06080D',
            borderBottom: '1px solid #141C2A',
            overflowX: 'auto',
          }}
        >
          {stagesList.map((st, i) => {
            const isSelected = st.id === currentStage;
            const isDone = isSimulating
              ? activeSimIdx > i
              : isRecovered || i <= 3;
            const isRunning = isSimulating && activeSimIdx === i;

            return (
              <button
                key={st.id}
                onClick={() => onSelectStage(st.id)}
                style={{
                  flex: '0 0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 9px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.15)' : '#0B1017',
                  border: isSelected ? '1px solid #10B981' : isRunning ? '1px solid #38BDF8' : '1px solid #151E2B',
                  color: isSelected ? '#FFFFFF' : isRunning ? '#38BDF8' : '#94A3B8',
                  fontSize: '11px',
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 120ms ease',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {isDone ? (
                  <Check size={11} color="#10B981" />
                ) : isRunning ? (
                  <span className="animate-spin" style={{ display: 'inline-block', width: '9px', height: '9px', border: '1.5px solid #38BDF8', borderTopColor: 'transparent', borderRadius: '50%' }} />
                ) : (
                  <span style={{ fontSize: '10px', color: '#64748B' }}>{st.number}</span>
                )}
                <span>{st.id}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Stage Detail Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {/* ========================================================================= */}
          {/* STAGE 1: PAYMENT FAILED */}
          {/* ========================================================================= */}
          {currentStage === 'PAYMENT FAILED' && (
            <>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>
                    Payment Failure Detection
                  </h3>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#EF4444',
                      backgroundColor: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      padding: '2px 8px',
                      borderRadius: '3px',
                    }}
                  >
                    FAILED
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#94A3B8' }}>
                  Telemetry captured via incoming payment gateway failure webhook.
                </p>
              </div>

              {/* Banner */}
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  fontSize: '12.5px',
                  color: '#FCA5A5',
                  lineHeight: 1.45,
                }}
              >
                Payment failure detected and added to the AI recovery pipeline.
              </div>

              {/* Key Values Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '10px',
                  backgroundColor: '#0A0F17',
                  border: '1px solid #16202E',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px',
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Transaction:</span>
                  <div className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
                    {selectedCase.txId}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Customer:</span>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', marginTop: '2px' }}>
                    {selectedCase.customerName}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Amount:</span>
                  <div className="font-mono" style={{ fontSize: '14px', fontWeight: 700, color: '#EF4444', marginTop: '2px' }}>
                    {amountFormatted}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Status:</span>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#EF4444', marginTop: '2px' }}>
                    FAILED
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Failure reason:</span>
                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#CBD5E1', marginTop: '2px' }}>
                    {selectedCase.failureType}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Gateway response:</span>
                  <div className="font-mono" style={{ fontSize: '11.5px', fontWeight: 600, color: '#F59E0B', marginTop: '2px' }}>
                    {getGatewayCode()}
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Detected:</span>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                    Just now (10:32:01 AM IST)
                  </div>
                </div>
              </div>

              {/* Status Checkmarks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#10B981' }}>
                  <CheckCircle2 size={15} />
                  <span>Failure detected</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#10B981' }}>
                  <CheckCircle2 size={15} />
                  <span>Transaction captured</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#10B981' }}>
                  <CheckCircle2 size={15} />
                  <span>Recovery workflow created</span>
                </div>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* STAGE 2: ANALYZING */}
          {/* ========================================================================= */}
          {currentStage === 'ANALYZING' && (
            <>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>
                    AI Analysis in Progress
                  </h3>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: isCurrentStageProcessing ? '#38BDF8' : '#10B981',
                      backgroundColor: isCurrentStageProcessing ? 'rgba(56, 189, 248, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                      border: isCurrentStageProcessing ? '1px solid #38BDF8' : '1px solid #10B981',
                      padding: '2px 8px',
                      borderRadius: '3px',
                    }}
                  >
                    {isCurrentStageProcessing ? '● ANALYZING' : '✓ COMPLETE'}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#94A3B8' }}>
                  Extracting downtime windows, issuer signals, and customer repayment history.
                </p>
              </div>

              {/* Transaction & Amount header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: '#0A0F17',
                  border: '1px solid #16202E',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Transaction:</span>
                  <div className="font-mono" style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF' }}>
                    {selectedCase.txId}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Amount:</span>
                  <div className="font-mono" style={{ fontSize: '14px', fontWeight: 700, color: '#10B981' }}>
                    {amountFormatted}
                  </div>
                </div>
              </div>

              {/* Live execution progress if currently running */}
              {isCurrentStageProcessing && (
                <div
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: '#38BDF8', fontWeight: 600 }}>Checking payment history</span>
                    <span className="font-mono" style={{ color: '#38BDF8', fontWeight: 700 }}>80%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#091321', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '80%', height: '100%', backgroundColor: '#38BDF8', transition: 'width 300ms ease' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '6px' }}>
                    Current operation: Analyzing previous retry attempts and gateway load...
                  </div>
                </div>
              )}

              {/* Steps list */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '8px' }}>
                  Analysis Steps:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    'Loading transaction history',
                    'Checking previous payment attempts',
                    'Checking gateway response',
                    'Checking customer payment behavior',
                    'Analyzing failure context',
                  ].map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#10B981' }}>
                      <CheckCircle2 size={14} />
                      <span style={{ color: '#F1F5F9' }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Result Summary */}
              <div
                style={{
                  backgroundColor: '#0A0F17',
                  border: '1px solid #16202E',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#10B981' }}>
                  ✓ Analysis complete
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: '#94A3B8' }}>Detected pattern:</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>Temporary gateway/bank failure</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: '#94A3B8' }}>Confidence:</span>
                  <span className="font-mono" style={{ color: '#10B981', fontWeight: 700 }}>{selectedCase.confidence}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: '#94A3B8' }}>Processing time:</span>
                  <span className="font-mono" style={{ color: '#CBD5E1' }}>1.2s</span>
                </div>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* STAGE 3: CLASSIFYING */}
          {/* ========================================================================= */}
          {currentStage === 'CLASSIFYING' && (
            <>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>
                    AI Failure Classification
                  </h3>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#818CF8',
                      backgroundColor: 'rgba(129, 140, 248, 0.12)',
                      border: '1px solid rgba(129, 140, 248, 0.3)',
                      padding: '2px 8px',
                      borderRadius: '3px',
                    }}
                  >
                    TAXONOMY
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#94A3B8' }}>
                  Decline taxonomy mapping to evaluate transient vs permanent failure probability.
                </p>
              </div>

              {/* Transaction & Classification */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#0A0F17',
                  border: '1px solid #16202E',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Transaction:</span>
                  <div className="font-mono" style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF' }}>
                    {selectedCase.txId}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Classification:</span>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#38BDF8' }}>
                    {selectedCase.failureType}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Confidence:</span>
                  <div className="font-mono" style={{ fontSize: '13.5px', fontWeight: 700, color: '#10B981' }}>
                    {selectedCase.confidence}%
                  </div>
                </div>
              </div>

              {/* Possible Classifications breakdown */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '8px' }}>
                  Possible Classifications:
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Temporary bank failure', pct: selectedCase.failureType === 'Temporary bank failure' ? 94 : 3, color: '#10B981' },
                    { label: 'Expired card', pct: selectedCase.failureType === 'Expired card' ? 92 : 3, color: '#F59E0B' },
                    { label: 'Insufficient funds', pct: selectedCase.failureType === 'Insufficient funds' ? 88 : 2, color: '#38BDF8' },
                    { label: 'Authentication failure', pct: 1, color: '#64748B' },
                  ].map((cls) => (
                    <div key={cls.label} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ color: '#E2E8F0' }}>{cls.label}</span>
                        <span className="font-mono" style={{ fontWeight: 600, color: cls.color }}>{cls.pct}%</span>
                      </div>
                      <div style={{ width: '100%', height: '5px', backgroundColor: '#131A26', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${cls.pct}%`, height: '100%', backgroundColor: cls.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation note */}
              <div
                style={{
                  backgroundColor: '#0A0F17',
                  border: '1px solid #16202E',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  fontSize: '12.5px',
                  color: '#94A3B8',
                  lineHeight: 1.5,
                }}
              >
                "{getExplanation()}"
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* STAGE 4: PREDICTING */}
          {/* ========================================================================= */}
          {currentStage === 'PREDICTING' && (
            <>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>
                    Recovery Probability Model
                  </h3>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#A855F7',
                      backgroundColor: 'rgba(168, 85, 247, 0.12)',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      padding: '2px 8px',
                      borderRadius: '3px',
                    }}
                  >
                    BAYESIAN MODEL
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#94A3B8' }}>
                  Multi-factor probability calculation based on telemetry and retry behavior.
                </p>
              </div>

              {/* Probability & Potential Recovery */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#0A0F17',
                    border: '1px solid #16202E',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Recovery probability:</span>
                  <div className="font-mono" style={{ fontSize: '22px', fontWeight: 700, color: '#10B981', marginTop: '2px' }}>
                    {selectedCase.recoveryProbability}%
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#0A0F17',
                    border: '1px solid #16202E',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Potential recovery:</span>
                  <div className="font-mono" style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
                    {potentialRecoveryFormatted}
                  </div>
                </div>
              </div>

              {/* Decision Factors */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '8px' }}>
                  Decision Factors:
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Payment history', pct: selectedCase.factors.paymentHistory },
                    { label: 'Failure type', pct: selectedCase.factors.failureType },
                    { label: 'Retry history', pct: selectedCase.factors.retryHistory },
                    { label: 'Customer reliability', pct: selectedCase.factors.customerReliability },
                  ].map((f) => (
                    <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ color: '#94A3B8' }}>{f.label}</span>
                        <span className="font-mono" style={{ fontWeight: 600, color: '#10B981' }}>{f.pct}%</span>
                      </div>
                      <div style={{ width: '100%', height: '5px', backgroundColor: '#131A26', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${f.pct}%`, height: '100%', backgroundColor: '#10B981' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendation Card */}
              <div
                style={{
                  backgroundColor: '#0A0F17',
                  border: '1px solid #16202E',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>AI Recommendation:</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '2px 7px', borderRadius: '3px' }}>
                    HIGH PRIORITY
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>Recommended strategy:</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#10B981' }}>
                    {selectedCase.recommendedAction}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>Expected recovery:</span>
                  <span className="font-mono" style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF' }}>
                    {potentialRecoveryFormatted}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* STAGE 5: RECOVERING */}
          {/* ========================================================================= */}
          {currentStage === 'RECOVERING' && (
            <>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>
                    Recovery Execution
                  </h3>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: isRecovered ? '#10B981' : isExecutingRecovery ? '#38BDF8' : '#F59E0B',
                      backgroundColor: isRecovered ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                      border: isRecovered ? '1px solid #10B981' : '1px solid #F59E0B',
                      padding: '2px 8px',
                      borderRadius: '3px',
                    }}
                  >
                    {isRecovered ? '✓ SUCCESS' : isExecutingRecovery ? '● SIMULATING' : 'READY'}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#94A3B8' }}>
                  Autonomous dispatch of targeted cooldown retry or alternative checkout rail.
                </p>
              </div>

              {/* Transaction & Strategy */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: '#0A0F17',
                  border: '1px solid #16202E',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Transaction:</span>
                  <div className="font-mono" style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF' }}>
                    {selectedCase.txId}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
                    Strategy: <strong style={{ color: '#10B981' }}>{selectedCase.recommendedAction}</strong>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Potential recovery:</span>
                  <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: '#10B981' }}>
                    {potentialRecoveryFormatted}
                  </div>
                </div>
              </div>

              {/* Execution Steps */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginBottom: '8px' }}>
                  Execution Timeline:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    'Recovery strategy selected',
                    'Retry scheduled',
                    'Payment gateway request simulated',
                    'Gateway response received',
                  ].map((st, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#10B981' }}>
                      <CheckCircle2 size={14} />
                      <span style={{ color: '#F1F5F9' }}>{st}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Result Outcome */}
              {isRecovered ? (
                <div
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid #10B981',
                    borderRadius: 'var(--radius-sm)',
                    padding: '14px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#10B981', letterSpacing: '0.04em' }}>
                    SUCCESS
                  </div>
                  <div className="font-mono" style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', margin: '4px 0' }}>
                    {potentialRecoveryFormatted} recovered
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>
                    Captured and credited into merchant recovery ledger in demo sandbox.
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: '#0A0F17',
                    border: '1px solid #16202E',
                    borderRadius: 'var(--radius-sm)',
                    padding: '14px',
                  }}
                >
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '12px' }}>
                    Because this project is in Demo/Sandbox mode, clicking execute will simulate the recovery execution locally.
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={onExecuteRecovery}
                      disabled={isExecutingRecovery || isSimulating}
                      className="btn-emerald"
                      style={{ padding: '7px 18px' }}
                    >
                      {isExecutingRecovery ? 'Simulating...' : 'Execute Recovery Simulation'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ========================================================================= */}
          {/* STAGE 6: MEASURED */}
          {/* ========================================================================= */}
          {currentStage === 'MEASURED' && (
            <>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>
                    Recovery Result
                  </h3>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: isRecovered ? '#10B981' : '#94A3B8',
                      backgroundColor: isRecovered ? 'rgba(16, 185, 129, 0.12)' : 'rgba(148, 163, 184, 0.12)',
                      border: isRecovered ? '1px solid #10B981' : '1px solid #475569',
                      padding: '2px 8px',
                      borderRadius: '3px',
                    }}
                  >
                    {isRecovered ? 'RECOVERED' : 'PENDING EVALUATION'}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#94A3B8' }}>
                  Final revenue impact, gateway fee attribution, and ledger reconciliation.
                </p>
              </div>

              {/* Measured Metrics 2x2 Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#0A0F17',
                    border: '1px solid #16202E',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Original amount:</span>
                  <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
                    {amountFormatted}
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#0A0F17',
                    border: '1px solid #16202E',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Recovered:</span>
                  <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: isRecovered ? '#10B981' : '#94A3B8', marginTop: '2px' }}>
                    {isRecovered ? potentialRecoveryFormatted : '₹0'}
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#0A0F17',
                    border: '1px solid #16202E',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Recovery rate:</span>
                  <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: isRecovered ? '#10B981' : '#94A3B8', marginTop: '2px' }}>
                    {isRecovered ? '82%' : '0%'}
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#0A0F17',
                    border: '1px solid #16202E',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Status:</span>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: isRecovered ? '#10B981' : '#F59E0B', marginTop: '2px' }}>
                    {selectedCase.status}
                  </div>
                </div>
              </div>

              {/* Complete Attribution Summary */}
              <div
                style={{
                  backgroundColor: '#0A0F17',
                  border: '1px solid #16202E',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: '#94A3B8' }}>Revenue recovered:</span>
                  <span className="font-mono" style={{ color: isRecovered ? '#10B981' : '#94A3B8', fontWeight: 700 }}>
                    {isRecovered ? potentialRecoveryFormatted : '₹0'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: '#94A3B8' }}>Recovery probability:</span>
                  <span className="font-mono" style={{ color: '#FFFFFF', fontWeight: 600 }}>{selectedCase.recoveryProbability}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: '#94A3B8' }}>AI confidence:</span>
                  <span className="font-mono" style={{ color: '#FFFFFF', fontWeight: 600 }}>{selectedCase.confidence}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: '#94A3B8' }}>Strategy used:</span>
                  <span style={{ color: '#10B981', fontWeight: 600 }}>{selectedCase.recommendedAction}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                  <span style={{ color: '#94A3B8' }}>Timestamp:</span>
                  <span style={{ color: '#CBD5E1' }}>Just now</span>
                </div>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* VISIBLE EXECUTION TIMELINE (ON EVERY STAGE) */}
          {/* ========================================================================= */}
          <div
            style={{
              backgroundColor: '#090D15',
              border: '1px solid #161F2E',
              borderRadius: 'var(--radius-sm)',
              padding: '14px 16px',
            }}
          >
            <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#FFFFFF', marginBottom: '12px' }}>
              Autonomous Execution Timeline
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { time: '14:32:01', event: 'Payment failure detected', stage: 1 },
                { time: '14:32:02', event: 'Transaction analyzed', stage: 2 },
                { time: '14:32:03', event: 'Failure classified', stage: 3 },
                { time: '14:32:04', event: 'Recovery probability calculated', stage: 4 },
                { time: '14:32:05', event: 'Recovery strategy selected', stage: 5 },
                { time: '14:32:07', event: 'Recovery simulated', stage: 5 },
                { time: '14:32:08', event: 'Result measured', stage: 6 },
              ].map((step, idx) => {
                const isPassed = isSimulating ? activeSimIdx >= step.stage - 1 : isRecovered || step.stage <= 4;
                const isLive = isSimulating && activeSimIdx === step.stage - 1;

                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
                    <span className="font-mono" style={{ color: '#64748B', width: '56px', flexShrink: 0 }}>
                      {step.time}
                    </span>

                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: isLive ? '#38BDF8' : isPassed ? '#10B981' : '#334155',
                        boxShadow: isLive ? '0 0 6px #38BDF8' : 'none',
                        flexShrink: 0,
                      }}
                    />

                    <span style={{ color: isLive ? '#38BDF8' : isPassed ? '#F1F5F9' : '#64748B', fontWeight: isLive ? 600 : 400 }}>
                      {step.event}
                    </span>

                    {isLive && (
                      <span className="animate-pulse" style={{ fontSize: '10px', color: '#38BDF8', marginLeft: 'auto' }}>
                        ● Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Footer Navigation */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid #141C2A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#090D15',
          }}
        >
          <button
            onClick={() => {
              if (currentStageIdx > 0) {
                onSelectStage(stagesList[currentStageIdx - 1].id);
              }
            }}
            disabled={currentStageIdx === 0}
            className="btn-dark-outline"
            style={{ opacity: currentStageIdx === 0 ? 0.3 : 1 }}
          >
            ← Previous Stage
          </button>

          <button
            onClick={() => {
              if (currentStageIdx < stagesList.length - 1) {
                onSelectStage(stagesList[currentStageIdx + 1].id);
              } else {
                onClose();
              }
            }}
            className="btn-emerald"
          >
            {currentStageIdx === stagesList.length - 1 ? 'Close Inspector' : 'Next Stage →'}
          </button>
        </div>
      </div>
    </div>
  );
};
