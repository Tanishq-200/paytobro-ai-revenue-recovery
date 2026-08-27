import React, { createContext, useContext, useState, useEffect } from 'react';

export interface DemoCase {
  id: string;
  txId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking';
  failureType: string;
  failureCode: string;
  confidence: number;
  recoveryProbability: number;
  recommendedAction: string;
  strategyKey: 'retry_delayed' | 'update_card' | 'retry_later' | 'auth_request' | 'retry_shortly';
  potentialRecovery: number;
  status: 'Pending' | 'Analyzing' | 'Recovering' | 'Recovered' | 'Failed';
  attempts: number;
  maxAttempts: number;
  factors: {
    paymentHistory: number;
    failureType: number;
    retryHistory: number;
    customerReliability: number;
  };
  timeline: Array<{ title: string; time: string; status: 'completed' | 'current' | 'pending' }>;
}

export interface ActivityEvent {
  id: string;
  type: 'recovered' | 'strategy' | 'retry' | 'analyzing' | 'failed';
  title: string;
  txId: string;
  time: string;
  confidence: number;
  amount?: number;
}

export interface PipelineStats {
  failed: number;
  analyzing: number;
  classified: number;
  predicting: number;
  recovering: number;
  measured: number;
}

export interface RevenueMetrics {
  revenueAtRisk: number;
  recoverableRevenue: number;
  revenueRecovered: number;
  recoveryRate: number;
  totalRecoveredPayments: number;
}

export type PipelineStage =
  | 'PAYMENT FAILED'
  | 'ANALYZING'
  | 'CLASSIFYING'
  | 'PREDICTING'
  | 'RECOVERING'
  | 'MEASURED'
  | null;

export type AgentStatus = 'Ready' | 'Agent Processing' | 'Simulation Complete';

interface RecoveryContextType {
  cases: DemoCase[];
  selectedCaseId: string;
  selectedCase: DemoCase;
  setSelectedCaseId: (id: string) => void;
  pipelineStats: PipelineStats;
  activeStage: PipelineStage;
  agentStatus: AgentStatus;
  revenueMetrics: RevenueMetrics;
  activityFeed: ActivityEvent[];
  isSimulating: boolean;
  runSimulation: () => Promise<void>;
  executeRecovery: (caseId: string) => Promise<{ success: boolean; message: string; recoveredAmount?: number }>;
  resetDemo: () => void;
}

// Initial baseline cases from prototype (Screen 22, 23, 28)
const INITIAL_CASES: DemoCase[] = [
  {
    id: 'CASE_9281',
    txId: 'RZP_9281',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul.sharma@gmail.com',
    amount: 24500,
    paymentMethod: 'UPI',
    failureType: 'Temporary bank failure',
    failureCode: 'DECLINED_BY_BANK',
    confidence: 94,
    recoveryProbability: 92,
    recommendedAction: 'Retry after 2 hours',
    strategyKey: 'retry_delayed',
    potentialRecovery: 20090,
    status: 'Pending',
    attempts: 1,
    maxAttempts: 3,
    factors: {
      paymentHistory: 82,
      failureType: 91,
      retryHistory: 71,
      customerReliability: 84,
    },
    timeline: [
      { title: 'Payment initiated', time: '10:31 AM', status: 'completed' },
      { title: 'Bank declined', time: '10:32 AM', status: 'completed' },
      { title: 'AI analyzed', time: '10:33 AM', status: 'completed' },
      { title: 'Retry recommended', time: '10:34 AM', status: 'completed' },
    ],
  },
  {
    id: 'CASE_7741',
    txId: 'RZP_7741',
    customerName: 'Priya Mehta',
    customerEmail: 'priya.m@techcorp.in',
    amount: 18200,
    paymentMethod: 'Card',
    failureType: 'Expired card',
    failureCode: 'CARD_EXPIRED',
    confidence: 98,
    recoveryProbability: 78,
    recommendedAction: 'Request updated payment method',
    strategyKey: 'update_card',
    potentialRecovery: 14196,
    status: 'Pending',
    attempts: 1,
    maxAttempts: 3,
    factors: {
      paymentHistory: 88,
      failureType: 65,
      retryHistory: 80,
      customerReliability: 92,
    },
    timeline: [
      { title: 'Card authorization initiated', time: '11:15 AM', status: 'completed' },
      { title: 'Declined: Card Expired', time: '11:15 AM', status: 'completed' },
      { title: 'AI analyzed: Request updated card', time: '11:16 AM', status: 'completed' },
    ],
  },
  {
    id: 'CASE_6671',
    txId: 'RZP_6671',
    customerName: 'Amit Verma',
    customerEmail: 'amit.verma@outlook.com',
    amount: 7800,
    paymentMethod: 'UPI',
    failureType: 'Insufficient funds',
    failureCode: 'LOW_BALANCE',
    confidence: 89,
    recoveryProbability: 64,
    recommendedAction: 'Retry later / Smart reminder',
    strategyKey: 'retry_later',
    potentialRecovery: 4992,
    status: 'Pending',
    attempts: 1,
    maxAttempts: 3,
    factors: {
      paymentHistory: 60,
      failureType: 54,
      retryHistory: 68,
      customerReliability: 72,
    },
    timeline: [
      { title: 'UPI checkout attempted', time: '12:05 PM', status: 'completed' },
      { title: 'Account low balance', time: '12:05 PM', status: 'completed' },
      { title: 'AI scheduled morning reminder', time: '12:06 PM', status: 'completed' },
    ],
  },
  {
    id: 'CASE_8912',
    txId: 'RZP_8912',
    customerName: 'Sneha Kapoor',
    customerEmail: 'sneha.k@gmail.com',
    amount: 4300,
    paymentMethod: 'NetBanking',
    failureType: 'Authentication failure',
    failureCode: '3DS_TIMEOUT',
    confidence: 91,
    recoveryProbability: 51,
    recommendedAction: 'Request customer authentication',
    strategyKey: 'auth_request',
    potentialRecovery: 2193,
    status: 'Pending',
    attempts: 1,
    maxAttempts: 3,
    factors: {
      paymentHistory: 52,
      failureType: 48,
      retryHistory: 60,
      customerReliability: 65,
    },
    timeline: [
      { title: 'OTP generation requested', time: '01:20 PM', status: 'completed' },
      { title: 'OTP expired / Timeout', time: '01:23 PM', status: 'completed' },
      { title: 'AI 1-click retry link sent', time: '01:24 PM', status: 'completed' },
    ],
  },
  {
    id: 'CASE_9285',
    txId: 'RZP_9285',
    customerName: 'Arjun Rao',
    customerEmail: 'arjun.rao@consulting.com',
    amount: 12600,
    paymentMethod: 'Card',
    failureType: 'Network issue',
    failureCode: 'GATEWAY_TIMEOUT',
    confidence: 96,
    recoveryProbability: 86,
    recommendedAction: 'Retry shortly (network cleared)',
    strategyKey: 'retry_shortly',
    potentialRecovery: 10836,
    status: 'Pending',
    attempts: 1,
    maxAttempts: 3,
    factors: {
      paymentHistory: 90,
      failureType: 88,
      retryHistory: 85,
      customerReliability: 88,
    },
    timeline: [
      { title: 'Gateway request timeout', time: '02:10 PM', status: 'completed' },
      { title: 'Network handshake failed', time: '02:11 PM', status: 'completed' },
    ],
  },
];

const INITIAL_STATS: PipelineStats = {
  failed: 142,
  analyzing: 128,
  classified: 94,
  predicting: 94,
  recovering: 25,
  measured: 18,
};

const INITIAL_METRICS: RevenueMetrics = {
  revenueAtRisk: 1749443.91,
  recoverableRevenue: 1102400.50,
  revenueRecovered: 240800.75,
  recoveryRate: 72.5,
  totalRecoveredPayments: 2300,
};

const INITIAL_FEED: ActivityEvent[] = [
  {
    id: 'act_1',
    type: 'recovered',
    title: '✓ ₹19,000 successfully recovered',
    txId: 'RZP_4007',
    time: '25m ago',
    confidence: 91,
    amount: 19000,
  },
  {
    id: 'act_2',
    type: 'strategy',
    title: '⚡ Alternative payment link generated for expired card',
    txId: 'RZP_7741',
    time: '18m ago',
    confidence: 98,
  },
  {
    id: 'act_3',
    type: 'retry',
    title: '↻ Retry scheduled for 2 hours (bank switch clearance)',
    txId: 'RZP_1024',
    time: '6m ago',
    confidence: 92,
  },
];

const RecoveryContext = createContext<RecoveryContextType | null>(null);

export const RecoveryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<DemoCase[]>(() => {
    const saved = localStorage.getItem('paytobro_cases');
    return saved ? JSON.parse(saved) : INITIAL_CASES;
  });

  const [selectedCaseId, setSelectedCaseId] = useState<string>('RZP_9281');

  const [pipelineStats, setPipelineStats] = useState<PipelineStats>(() => {
    const saved = localStorage.getItem('paytobro_stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics>(() => {
    const saved = localStorage.getItem('paytobro_metrics');
    return saved ? JSON.parse(saved) : INITIAL_METRICS;
  });

  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>(() => {
    const saved = localStorage.getItem('paytobro_feed');
    return saved ? JSON.parse(saved) : INITIAL_FEED;
  });

  const [activeStage, setActiveStage] = useState<PipelineStage>(null);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('Ready');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('paytobro_cases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem('paytobro_stats', JSON.stringify(pipelineStats));
  }, [pipelineStats]);

  useEffect(() => {
    localStorage.setItem('paytobro_metrics', JSON.stringify(revenueMetrics));
  }, [revenueMetrics]);

  useEffect(() => {
    localStorage.setItem('paytobro_feed', JSON.stringify(activityFeed));
  }, [activityFeed]);

  const selectedCase = cases.find((c) => c.txId === selectedCaseId || c.id === selectedCaseId) || cases[0];

  // Run Staged Simulation
  const runSimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setAgentStatus('Agent Processing');

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      // Stage 1: PAYMENT FAILED
      setActiveStage('PAYMENT FAILED');
      setPipelineStats((prev) => ({
        ...prev,
        failed: prev.failed + 12,
      }));
      await sleep(1000);

      // Stage 2: ANALYZING
      setActiveStage('ANALYZING');
      setPipelineStats((prev) => ({
        ...prev,
        analyzing: prev.analyzing + 10,
      }));
      await sleep(1000);

      // Stage 3: CLASSIFYING
      setActiveStage('CLASSIFYING');
      setPipelineStats((prev) => ({
        ...prev,
        classified: prev.classified + 8,
      }));
      await sleep(1000);

      // Stage 4: PREDICTING
      setActiveStage('PREDICTING');
      setPipelineStats((prev) => ({
        ...prev,
        predicting: prev.predicting + 8,
      }));
      await sleep(1000);

      // Stage 5: RECOVERING
      setActiveStage('RECOVERING');
      setPipelineStats((prev) => ({
        ...prev,
        recovering: prev.recovering + 6,
      }));
      await sleep(1200);

      // Stage 6: MEASURED
      setActiveStage('MEASURED');
      const newlyRecoveredAmount = 24500;
      setPipelineStats((prev) => ({
        ...prev,
        recovering: Math.max(0, prev.recovering - 3),
        measured: prev.measured + 5,
      }));

      // Update Revenue Metrics
      setRevenueMetrics((prev) => {
        const newRecovered = prev.revenueRecovered + newlyRecoveredAmount;
        const newTotalCount = prev.totalRecoveredPayments + 1;
        const newRate = Math.min(96.5, Math.round((newRecovered / (prev.recoverableRevenue || 1)) * 1000) / 10);
        return {
          ...prev,
          revenueRecovered: newRecovered,
          recoveryRate: newRate,
          totalRecoveredPayments: newTotalCount,
        };
      });

      // Update RZP_9281 to Recovered
      setCases((prev) =>
        prev.map((c) =>
          c.txId === 'RZP_9281'
            ? {
                ...c,
                status: 'Recovered',
                timeline: [
                  ...c.timeline,
                  { title: 'Simulated payment recovered', time: 'Just now', status: 'completed' },
                ],
              }
            : c
        )
      );

      // Add to Live Activity Feed
      const newEvent: ActivityEvent = {
        id: `act_${Date.now()}`,
        type: 'recovered',
        title: `✓ ₹${newlyRecoveredAmount.toLocaleString('en-IN')} successfully recovered`,
        txId: 'RZP_9281',
        time: 'Just now',
        confidence: 94,
        amount: newlyRecoveredAmount,
      };
      setActivityFeed((prev) => [newEvent, ...prev]);

      setAgentStatus('Simulation Complete');
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
      setTimeout(() => {
        setActiveStage(null);
        setAgentStatus('Ready');
      }, 3000);
    }
  };

  // Execute recovery for a specific case in Demo/Sandbox mode
  const executeRecovery = async (caseId: string) => {
    const targetCase = cases.find((c) => c.txId === caseId || c.id === caseId);
    if (!targetCase) return { success: false, message: 'Case not found' };

    // Simulate recovery progress
    await new Promise((r) => setTimeout(r, 900));

    const recoveredAmount = targetCase.amount;

    // Update case status
    setCases((prev) =>
      prev.map((c) =>
        c.txId === targetCase.txId
          ? {
              ...c,
              status: 'Recovered',
              timeline: [
                ...c.timeline,
                { title: `Simulated recovery action executed (${c.recommendedAction})`, time: 'Just now', status: 'completed' },
                { title: `Revenue of ₹${recoveredAmount.toLocaleString('en-IN')} captured`, time: 'Just now', status: 'completed' },
              ],
            }
          : c
      )
    );

    // Update global dashboard statistics
    setRevenueMetrics((prev) => {
      const newRecovered = prev.revenueRecovered + recoveredAmount;
      const newTotal = prev.totalRecoveredPayments + 1;
      const newRate = Math.min(99.0, Math.round((newRecovered / (prev.recoverableRevenue || 1)) * 1000) / 10);
      return {
        ...prev,
        revenueRecovered: newRecovered,
        recoveryRate: newRate,
        totalRecoveredPayments: newTotal,
      };
    });

    // Update pipeline counts
    setPipelineStats((prev) => ({
      ...prev,
      recovering: Math.max(0, prev.recovering - 1),
      measured: prev.measured + 1,
    }));

    // Add to Live Activity Feed
    const event: ActivityEvent = {
      id: `act_${Date.now()}`,
      type: 'recovered',
      title: `✓ ₹${recoveredAmount.toLocaleString('en-IN')} successfully recovered`,
      txId: targetCase.txId,
      time: 'Just now',
      confidence: targetCase.confidence,
      amount: recoveredAmount,
    };
    setActivityFeed((prev) => [event, ...prev]);

    return {
      success: true,
      message: `₹${recoveredAmount.toLocaleString('en-IN')} successfully recovered`,
      recoveredAmount,
    };
  };

  // Reset Demo to Baseline
  const resetDemo = () => {
    localStorage.removeItem('paytobro_cases');
    localStorage.removeItem('paytobro_stats');
    localStorage.removeItem('paytobro_metrics');
    localStorage.removeItem('paytobro_feed');
    setCases(INITIAL_CASES);
    setSelectedCaseId('RZP_9281');
    setPipelineStats(INITIAL_STATS);
    setRevenueMetrics(INITIAL_METRICS);
    setActivityFeed(INITIAL_FEED);
    setActiveStage(null);
    setAgentStatus('Ready');
  };

  return (
    <RecoveryContext.Provider
      value={{
        cases,
        selectedCaseId,
        selectedCase,
        setSelectedCaseId,
        pipelineStats,
        activeStage,
        agentStatus,
        revenueMetrics,
        activityFeed,
        isSimulating,
        runSimulation,
        executeRecovery,
        resetDemo,
      }}
    >
      {children}
    </RecoveryContext.Provider>
  );
};

export const useRecovery = () => {
  const context = useContext(RecoveryContext);
  if (!context) {
    throw new Error('useRecovery must be used within a RecoveryProvider');
  }
  return context;
};
