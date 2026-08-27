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

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  reliability_score: number; // 0 to 100
  successful_payments_count: number;
  total_spent: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  customer_id: string;
  amount: number;
  currency: string;
  payment_method: PaymentMethod;
  gateway: string;
  failure_code: string;
  failure_reason: string;
  status: 'failed' | 'recovered' | 'abandoned';
  attempts_count: number;
  max_attempts: number;
  initiated_at: string;
  failed_at: string;
}

export interface DecisionFactors {
  payment_history: number;      // 0 - 100
  failure_type_score: number;   // 0 - 100
  retry_history_score: number;  // 0 - 100
  customer_reliability: number; // 0 - 100
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
  amount: number;
  payment_method: PaymentMethod;
  failure_code: string;
  failure_reason: string;
  failure_category: FailureCategory;
  failure_category_label: string;
  confidence_score: number;       // 0 - 100%
  recovery_probability: number;   // 0 - 100%
  potential_recovery: number;
  recommended_action: RecoveryActionType;
  recommended_action_label: string;
  action_delay_hours?: number;
  priority: PriorityLevel;
  priority_score: number;         // amount * probability * urgency factor
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

export interface AuditLog {
  id: string;
  case_id: string;
  transaction_id: string;
  timestamp: string;
  event_type: 'CLASSIFICATION' | 'PROBABILITY_ESTIMATION' | 'ACTION_RECOMMENDED' | 'SIMULATION_EXECUTED' | 'RECOVERY_SUCCEEDED' | 'RECOVERY_FAILED' | 'RECOVERY_REJECTED';
  failure_category?: string;
  confidence?: number;
  recommended_action?: string;
  rationale: string;
  outcome?: string;
}

export interface AgentActivityEvent {
  id: string;
  timestamp: string;
  transaction_id: string;
  event_type: 'ANALYSIS' | 'OPPORTUNITY' | 'PROBABILITY' | 'SCHEDULED' | 'RECOVERED' | 'DECISION';
  description: string;
  amount: number;
  confidence?: number;
  badge_color?: string;
}

export interface KpiMetrics {
  revenue_at_risk: number;
  recoverable_revenue: number;
  revenue_recovered: number;
  recovery_rate: number;
  active_cases_count: number;
  analyzed_count: number;
  classified_count: number;
  awaiting_count: number;
  recovered_count: number;
  failed_count: number;
}

export interface GuardrailsConfig {
  max_retry_attempts: number;
  cooldown_hours: number;
  min_recovery_probability_threshold: number;
  stop_on_permanent_failure: boolean;
  mask_sensitive_data: boolean;
  demo_mode_active: boolean;
}
