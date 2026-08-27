import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Check,
  Eye,
} from 'lucide-react';
import { useRecovery, PipelineStage } from '../context/RecoveryContext.js';
import { StageExecutionInspector } from '../components/StageExecutionInspector.js';

export const RecoveryAgentPage: React.FC = () => {
  const {
    cases,
    selectedCaseId,
    selectedCase,
    setSelectedCaseId,
    pipelineStats,
    activeStage,
    agentStatus,
    activityFeed,
    isSimulating,
    runSimulation,
    executeRecovery,
    resetDemo,
  } = useRecovery();

  const [inspectedStage, setInspectedStage] = useState<PipelineStage | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<{ success: boolean; message: string; amount?: number } | null>(null);

  const pipelineStages: Array<{ label: PipelineStage; count: number; color: string; stepNum: number }> = [
    { label: 'PAYMENT FAILED', count: pipelineStats.failed, color: '#EF4444', stepNum: 1 },
    { label: 'ANALYZING', count: pipelineStats.analyzing, color: '#38BDF8', stepNum: 2 },
    { label: 'CLASSIFYING', count: pipelineStats.classified, color: '#818CF8', stepNum: 3 },
    { label: 'PREDICTING', count: pipelineStats.predicting, color: '#A855F7', stepNum: 4 },
    { label: 'RECOVERING', count: pipelineStats.recovering, color: '#F59E0B', stepNum: 5 },
    { label: 'MEASURED', count: pipelineStats.measured, color: '#10B981', stepNum: 6 },
  ];

  const handleConfirmRecovery = async () => {
    setIsExecuting(true);
    try {
      const res = await executeRecovery(selectedCase.txId);
      setExecutionResult({
        success: res.success,
        message: res.message,
        amount: res.recoveredAmount,
      });
      setShowConfirmModal(false);
    } catch (err) {
      setExecutionResult({
        success: false,
        message: 'Recovery action halted: Customer authentication timeout.',
      });
      setShowConfirmModal(false);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo recovery data, pipeline counters, and activity feed to baseline?')) {
      resetDemo();
      setExecutionResult(null);
      setInspectedStage(null);
    }
  };

  // Helper to determine status and styling for each stage card
  const getStageState = (idx: number, stageId: PipelineStage) => {
    const isSelected = inspectedStage === stageId;
    const isCurrentProcessing = isSimulating && activeStage === stageId;
    const activeSimIdx = pipelineStages.findIndex((s) => s.label === activeStage);

    let statusText = 'Live count';
    let isDone = false;
    let isWaiting = false;

    if (isSimulating) {
      if (activeSimIdx > idx) {
        statusText = '✓ Completed';
        isDone = true;
      } else if (activeSimIdx === idx) {
        statusText = '● Processing';
      } else {
        statusText = '○ Waiting';
        isWaiting = true;
      }
    } else {
      if (selectedCase.status === 'Recovered' || agentStatus === 'Simulation Complete') {
        statusText = '✓ Completed';
        isDone = true;
      } else if (idx <= 3) {
        statusText = '✓ Analyzed';
        isDone = true;
      } else if (idx === 4) {
        statusText = selectedCase.status === 'Recovering' ? '● In Progress' : 'Ready to Run';
      } else {
        statusText = 'Awaiting Result';
        isWaiting = true;
      }
    }

    return { isSelected, isCurrentProcessing, statusText, isDone, isWaiting };
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {/* Top Header Row with Transaction Selector & Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Recovery Agent
            </h2>

            {/* Agent Status Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isSimulating ? 'rgba(56, 189, 248, 0.15)' : 'rgba(16, 185, 129, 0.12)',
                border: isSimulating ? '1px solid #38BDF8' : '1px solid rgba(16, 185, 129, 0.3)',
                fontSize: '11px',
                color: isSimulating ? '#38BDF8' : '#34D399',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: isSimulating ? '#38BDF8' : '#10B981',
                  boxShadow: isSimulating ? '0 0 6px #38BDF8' : '0 0 6px #10B981',
                }}
              />
              <span>
                {isSimulating
                  ? '● Agent Processing'
                  : agentStatus === 'Simulation Complete'
                  ? '✓ Simulation Complete'
                  : '● Autonomous Pipeline Active'}
              </span>
            </div>
          </div>

          <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
            Autonomous multi-stage AI analysis, classification, and simulated recovery. Click any stage below to inspect execution details.
          </p>
        </div>

        {/* Action Controls & Transaction Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Case Selector Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>Select Case:</span>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              style={{
                backgroundColor: '#0C1017',
                border: '1px solid #1A2436',
                color: '#FFFFFF',
                fontSize: '12px',
                padding: '5px 10px',
                borderRadius: 'var(--radius-sm)',
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {cases.slice(0, 4).map((c) => (
                <option key={c.txId} value={c.txId}>
                  {c.txId} — ₹{c.amount.toLocaleString('en-IN')} ({c.customerName})
                </option>
              ))}
            </select>
          </div>

          {/* Reset Demo Button */}
          <button onClick={handleReset} className="btn-dark-outline" title="Reset all demo state">
            <RotateCcw size={12} />
            <span>Reset Demo</span>
          </button>

          {/* Run Recovery Simulation */}
          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="btn-emerald"
          >
            <Play size={12} fill="currentColor" className={isSimulating ? 'animate-spin' : ''} />
            <span>{isSimulating ? 'Simulating Pipeline...' : 'Run Recovery Simulation'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6-STAGE PIPELINE: FULLY CLICKABLE CARDS WITH CONNECTORS & LIVE STATES */}
      {/* ========================================================================= */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '2px',
        }}
      >
        {pipelineStages.map((st, idx) => {
          const { isSelected, isCurrentProcessing, statusText, isDone, isWaiting } = getStageState(idx, st.label);
          const isLast = idx === pipelineStages.length - 1;

          return (
            <React.Fragment key={st.label}>
              {/* Pipeline Stage Card */}
              <div
                onClick={() => setInspectedStage(st.label)}
                title={`Click to inspect ${st.label} execution details`}
                style={{
                  flex: 1,
                  minWidth: '135px',
                  padding: '12px 10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: isCurrentProcessing
                    ? `1.5px solid ${st.color}`
                    : isSelected
                    ? `1.5px solid #10B981`
                    : isDone
                    ? '1px solid rgba(16, 185, 129, 0.4)'
                    : '1px solid var(--border-card)',
                  backgroundColor: isCurrentProcessing
                    ? 'rgba(16, 22, 34, 0.95)'
                    : isSelected
                    ? 'rgba(16, 185, 129, 0.08)'
                    : '#0C1017',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: isCurrentProcessing
                    ? `0 0 16px ${st.color}40`
                    : isSelected
                    ? '0 0 14px rgba(16, 185, 129, 0.25)'
                    : 'none',
                  transition: 'all 150ms ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isCurrentProcessing && !isSelected) {
                    e.currentTarget.style.borderColor = st.color;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCurrentProcessing && !isSelected) {
                    e.currentTarget.style.borderColor = isDone ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-card)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {/* Top Badge Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: st.color,
                      letterSpacing: '0.03em',
                    }}
                  >
                    {st.label}
                  </span>
                  {isSelected && (
                    <Eye size={10} color="#10B981" />
                  )}
                </div>

                {/* Big Metric Value */}
                <div
                  className="font-mono"
                  style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    marginTop: '4px',
                    lineHeight: 1.1,
                  }}
                >
                  {st.count}
                </div>

                {/* Status Indicator Pill */}
                <div
                  style={{
                    fontSize: '10px',
                    marginTop: '4px',
                    fontWeight: 600,
                    color: isCurrentProcessing
                      ? '#38BDF8'
                      : isDone
                      ? '#34D399'
                      : isWaiting
                      ? '#64748B'
                      : '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '3px',
                  }}
                >
                  {isCurrentProcessing && (
                    <span className="animate-spin" style={{ display: 'inline-block', width: '7px', height: '7px', border: '1.5px solid #38BDF8', borderTopColor: 'transparent', borderRadius: '50%' }} />
                  )}
                  <span>{statusText}</span>
                </div>
              </div>

              {/* Arrow Connector between horizontal stage cards */}
              {!isLast && (
                <div style={{ color: '#2B374D', display: 'flex', alignItems: 'center', padding: '0 1px' }}>
                  <ArrowRight size={12} color="#475569" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Two Columns: AI Decision (Left) + Decision Factors (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
          gap: '14px',
        }}
      >
        {/* Left Card: AI Decision Panel */}
        <div
          className="s22-card"
          style={{
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
            minHeight: '270px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF' }}>
                AI Decision — <span className="font-mono" style={{ color: '#10B981' }}>{selectedCase.txId}</span>
              </div>
              <span className={selectedCase.status === 'Recovered' ? 'status-pill-recovered' : 'status-pill-pending'}>
                {selectedCase.status}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', color: '#94A3B8' }}>Failure classification</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                  {selectedCase.failureType}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', color: '#94A3B8' }}>Confidence</span>
                <span className="font-mono" style={{ fontSize: '13px', fontWeight: 600, color: '#10B981' }}>
                  {selectedCase.confidence}%
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', color: '#94A3B8' }}>Recovery probability</span>
                <span className="font-mono" style={{ fontSize: '13px', fontWeight: 600, color: '#10B981' }}>
                  {selectedCase.recoveryProbability}%
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', color: '#94A3B8' }}>Recommended action</span>
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#10B981' }}>
                  {selectedCase.recommendedAction}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', color: '#94A3B8' }}>Potential recovery</span>
                <span className="font-mono" style={{ fontSize: '14px', fontWeight: 700, color: '#10B981' }}>
                  ₹{selectedCase.potentialRecovery.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '10px', borderTop: '1px solid #141B27' }}>
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={selectedCase.status === 'Recovered' || isExecuting}
              className="btn-emerald"
            >
              {selectedCase.status === 'Recovered' ? '✓ Payment Recovered' : 'Execute Recovery'}
            </button>

            {selectedCase.status === 'Recovered' && (
              <span style={{ fontSize: '11.5px', color: '#34D399', fontWeight: 500 }}>
                Revenue credited to merchant ledger in simulation.
              </span>
            )}
          </div>
        </div>

        {/* Right Card: Decision Factors Dynamic Bars */}
        <div
          className="s22-card"
          style={{
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '270px',
          }}
        >
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '14px' }}>
              Decision Factors
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Payment history', pct: selectedCase.factors.paymentHistory },
                { label: 'Failure type', pct: selectedCase.factors.failureType },
                { label: 'Retry history', pct: selectedCase.factors.retryHistory },
                { label: 'Customer reliability', pct: selectedCase.factors.customerReliability },
              ].map((f) => (
                <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                    <span style={{ color: '#94A3B8' }}>{f.label}</span>
                    <span className="font-mono" style={{ color: '#10B981', fontWeight: 600 }}>{f.pct}%</span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '6px',
                      backgroundColor: '#141C2B',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${f.pct}%`,
                        height: '100%',
                        backgroundColor: '#10B981',
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 300ms ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '10px' }}>
            Weights calculated via Bayesian classification model based on gateway telemetry.
          </div>
        </div>
      </div>

      {/* Live AI Agent Activity Feed Section */}
      <div className="s22-card" style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Sparkles size={14} color="#10B981" />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>
              Live AI Agent Activity
            </span>
          </div>

          <span style={{ fontSize: '11px', color: '#64748B' }}>
            Real-time automated decision log
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {activityFeed.slice(0, 5).map((act) => (
            <div
              key={act.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                backgroundColor: '#070A0F',
                border: '1px solid #161F2E',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: act.type === 'recovered' ? '#34D399' : '#F1F5F9',
                  }}
                >
                  {act.title}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="font-mono" style={{ fontSize: '11.5px', color: '#818CF8' }}>
                  {act.txId}
                </span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>{act.time}</span>
                <span
                  style={{
                    fontSize: '10.5px',
                    padding: '1.5px 5px',
                    borderRadius: '3px',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    color: '#34D399',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {act.confidence}% confidence
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STAGE EXECUTION INSPECTOR DRAWER / MODAL */}
      {/* ========================================================================= */}
      <StageExecutionInspector
        isOpen={inspectedStage !== null}
        onClose={() => setInspectedStage(null)}
        currentStage={inspectedStage}
        onSelectStage={(st) => setInspectedStage(st)}
        selectedCase={selectedCase}
        isSimulating={isSimulating}
        activeSimulationStage={activeStage}
        onExecuteRecovery={handleConfirmRecovery}
        isExecutingRecovery={isExecuting}
      />

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div
            className="s22-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '490px',
              width: '100%',
              padding: '22px',
              backgroundColor: '#080C14',
              border: '1px solid #1E273A',
            }}
          >
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
              Confirm Simulated Recovery Action
            </h3>
            <p style={{ fontSize: '12.5px', color: '#94A3B8', lineHeight: 1.5, marginBottom: '16px' }}>
              The Recovery Agent will execute <strong style={{ color: '#10B981' }}>{selectedCase.recommendedAction}</strong> for transaction <strong className="font-mono" style={{ color: '#FFFFFF' }}>{selectedCase.txId}</strong> (₹{selectedCase.amount.toLocaleString('en-IN')}).
            </p>

            <div
              style={{
                backgroundColor: '#05080E',
                border: '1px solid #151D2C',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '18px',
                fontSize: '12px',
                color: '#CBD5E1',
                lineHeight: 1.55,
              }}
            >
              <div>• Strategy: {selectedCase.recommendedAction}</div>
              <div>• Customer: {selectedCase.customerName} ({selectedCase.customerEmail})</div>
              <div>• Expected Recovery: ₹{selectedCase.potentialRecovery.toLocaleString('en-IN')}</div>
              <div>• Mode: Simulated Demo Sandbox (No real funds charged)</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn-dark-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRecovery}
                disabled={isExecuting}
                className="btn-emerald"
              >
                {isExecuting ? 'Executing Simulation...' : 'Confirm Action'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Execution Result Modal */}
      {executionResult && (
        <div className="modal-overlay" onClick={() => setExecutionResult(null)}>
          <div
            className="s22-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '430px',
              width: '100%',
              padding: '22px',
              backgroundColor: '#080C14',
              border: executionResult.success ? '1px solid #10B981' : '1px solid #EF4444',
              textAlign: 'center',
            }}
          >
            {executionResult.success ? (
              <>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid #10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}
                >
                  <CheckCircle2 size={22} color="#10B981" />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
                  Recovery Succeeded
                </h3>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#10B981', marginBottom: '8px' }}>
                  {executionResult.message}
                </p>
                <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '18px' }}>
                  Transaction status changed to <strong>Recovered</strong>. Dashboard revenue and recovery rate updated live!
                </p>
              </>
            ) : (
              <>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid #EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}
                >
                  <AlertCircle size={22} color="#EF4444" />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
                  Recovery Failed
                </h3>
                <p style={{ fontSize: '12.5px', color: '#F87171', marginBottom: '18px' }}>
                  {executionResult.message}
                </p>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                onClick={() => setExecutionResult(null)}
                className="btn-emerald"
                style={{ padding: '7px 22px' }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
