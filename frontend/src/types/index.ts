export type PaymentMethod = 'UPI' | 'Card' | 'NetBanking' | 'Wallet' | 'Mandate';

export type FailureCategory =
  | 'temporary_bank_decline'
  | 'insufficient_funds'
  | 'card_expired'
  | 'auth_failed_3ds'
  | 'network_timeout'
  | 'mandate_decline'
  | 'account_frozen';

export type RecoveryActionType =
  | 'retry_delayed'
  | 'retry_immediate'
  | 'send_reminder'
  | 'alt_payment_method'
  | 'contact_customer'
  | 'do_nothing';

export type CaseStatus =
  | 'analyzing'
  | 'classified'
  | 'recovery_pending'
  | 'executing'
  | 'recovered'
  | 'failed';

export type PriorityLevel = 'critical' | 'high' | 'normal' | 'low';

export interface DecisionFactors {
  payment_history: number;
  failure_type_score: number;
  retry_history_score: number;
  customer_reliability: number;
}

export interface TimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  status: 'completed' | 'current' | 'pending' | 'failed';
  description: string;
}

export interface RecoveryCase {
  id: string;
  transaction_id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_reliability?: number;
  amount: number;
  payment_method: PaymentMethod;
  failure_code: string;
  failure_reason: string;
  failure_category: FailureCategory;
  failure_category_label: string;
  confidence_score: number;
  recovery_probability: number;
  potential_recovery: number;
  recommended_action: RecoveryActionType;
  recommended_action_label: string;
  action_delay_hours?: number;
  priority: PriorityLevel;
  priority_score: number;
  status: CaseStatus;
  ai_explanation: string;
  decision_factors: DecisionFactors;
  timeline: TimelineEvent[];
  attempts_count: number;
  max_attempts: number;
  created_at: string;
  updated_at: string;
  recovered_at?: string;
  recovered_amount?: number;
}

export interface AgentActivityEvent {
  id: string;
  timestamp: string;
  transaction_id: string;
  event_type: string;
  description: string;
  amount: number;
  confidence?: number;
  badge_color?: string;
}

export interface KpiData {
  revenue_at_risk: number;
  recoverable_revenue: number;
  revenue_recovered: number;
  recovery_rate: number;
  pipeline: {
    analyzed: number;
    classified: number;
    awaiting_action: number;
    recovered: number;
  };
  last_updated: string;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  structured_data?: {
    total_potential_recovery?: number;
    cases?: Array<{
      transaction_id: string;
      customer_name: string;
      amount: number;
      recovery_probability: number;
      recommended_action: string;
      priority: string;
    }>;
    kpis?: {
      revenue_at_risk: number;
      recoverable_revenue: number;
      revenue_recovered: number;
      recovery_rate: number;
    };
    best_strategy?: {
      name: string;
      success_rate: number;
      recovered_amount: number;
    };
  };
}

export interface AuditLog {
  id: string;
  case_id: string;
  transaction_id: string;
  timestamp: string;
  event_type: string;
  failure_category?: string;
  confidence?: number;
  recommended_action?: string;
  rationale: string;
  outcome?: string;
}

export interface AnalyticsData {
  series7D: Array<{ date: string; failed: number; recoverable: number; recovered: number; rate: number }>;
  series30D: Array<{ date: string; failed: number; recoverable: number; recovered: number; rate: number }>;
  series90D: Array<{ date: string; failed: number; recoverable: number; recovered: number; rate: number }>;
  failureBreakdown: Array<{ name: string; percentage: number; count: number; recoverableRate: number; color: string }>;
  strategyPerformance: Array<{ strategy: string; successRate: number; avgRecovery: number; revenueRecovered: number; icon: string }>;
  priorityStats: Array<{ priority: string; count: number; total_value: number; avg_prob: number }>;
}

export interface SimulationResult {
  revenueAtRisk: number;
  potentialRecovery: number;
  revenueRecovered: number;
  recoveryRate: number;
  recoveredCount: number;
  failedCount: number;
  steps: Array<{
    stage: string;
    message: string;
    processedCount: number;
    totalCount: number;
  }>;
}

export interface GuardrailsConfig {
  max_retry_attempts: number;
  cooldown_hours: number;
  min_recovery_probability_threshold: number;
  stop_on_permanent_failure: boolean;
  mask_sensitive_data: boolean;
  demo_mode_active: boolean;
}
