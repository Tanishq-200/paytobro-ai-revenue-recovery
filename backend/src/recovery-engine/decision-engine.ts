import { classifyFailure } from './classifier.js';
import { evaluateGuardrails, defaultGuardrails } from './guardrails.js';
import { calculateRecoveryScore } from './scorer.js';
import {
  DecisionFactors,
  FailureCategory,
  GuardrailsConfig,
  PaymentMethod,
  PriorityLevel,
  RecoveryActionType,
} from '../types/index.js';

export interface DecisionResult {
  failure_category: FailureCategory;
  failure_category_label: string;
  confidence_score: number;
  recovery_probability: number;
  priority: PriorityLevel;
  priority_score: number;
  recommended_action: RecoveryActionType;
  recommended_action_label: string;
  action_delay_hours?: number;
  ai_explanation: string;
  decision_factors: DecisionFactors;
  guardrail_note?: string;
}

export function evaluatePaymentRecovery(params: {
  failureReason: string;
  failureCode: string;
  amount: number;
  paymentMethod: PaymentMethod;
  attemptsCount: number;
  customerReliability: number;
  config?: GuardrailsConfig;
}): DecisionResult {
  const {
    failureReason,
    failureCode,
    amount,
    paymentMethod,
    attemptsCount,
    customerReliability,
    config = defaultGuardrails,
  } = params;

  // 1. Classify the root cause
  const classification = classifyFailure(failureReason, failureCode);

  // 2. Score probability and priority
  const scoring = calculateRecoveryScore({
    category: classification.category,
    customerReliability,
    attemptCount: attemptsCount,
    paymentMethod,
    amount,
  });

  // 3. Evaluate safety guardrails
  const guardrailCheck = evaluateGuardrails(
    classification.category,
    attemptsCount,
    scoring.recovery_probability,
    config
  );

  // 4. Select best action and draft human-readable explanation
  let recommended_action: RecoveryActionType;
  let recommended_action_label: string;
  let action_delay_hours: number | undefined;
  let ai_explanation = '';

  if (!guardrailCheck.allowed) {
    recommended_action = guardrailCheck.enforcedAction || 'contact_customer';
    if (recommended_action === 'do_nothing') {
      recommended_action_label = 'Halt automated recovery (Do nothing)';
    } else {
      recommended_action_label = 'Escalate for manual merchant support';
    }
    ai_explanation = `Guardrail activated: ${guardrailCheck.reason}`;
  } else {
    switch (classification.category) {
      case 'temporary_bank_decline':
        recommended_action = 'retry_delayed';
        recommended_action_label = 'Retry payment after 2 hours';
        action_delay_hours = 2;
        ai_explanation =
          'Previous attempts indicate a temporary issuer-side failure. The customer has successfully completed similar payments previously. A delayed retry has a high probability of success.';
        break;

      case 'network_timeout':
        recommended_action = 'retry_immediate';
        recommended_action_label = 'Immediate retry via secondary routing switch';
        ai_explanation =
          'Failure was caused by an ephemeral gateway socket timeout. Immediate retry routed via backup banking rail has a 91% success likelihood.';
        break;

      case 'card_expired':
        recommended_action = 'alt_payment_method';
        recommended_action_label = 'Suggest alternative payment method (UPI / NetBanking)';
        ai_explanation =
          'The customer card has expired. Automated retries on the same instrument will fail. Dispatching an instant 1-click payment link pre-configured for UPI.';
        break;

      case 'insufficient_funds':
        recommended_action = 'send_reminder';
        recommended_action_label = 'Schedule smart reminder on next active morning';
        ai_explanation =
          'Customer encountered insufficient funds. Timing data shows high recovery when delivering a frictionless WhatsApp/SMS reminder during morning bank hours.';
        break;

      case 'auth_failed_3ds':
        recommended_action = 'send_reminder';
        recommended_action_label = 'Dispatch 1-tap re-authentication checkout link';
        ai_explanation =
          'Checkout was aborted during OTP / 3DS authentication. Customer intent is high; sending a revived 1-tap checkout session.';
        break;

      case 'mandate_decline':
        recommended_action = 'send_reminder';
        recommended_action_label = 'Send recurring mandate authorization link';
        ai_explanation =
          'Recurring debit mandate declined by issuer. Sending immediate authorization prompt to re-authorize payment token.';
        break;

      default:
        recommended_action = 'retry_delayed';
        recommended_action_label = 'Retry payment after 2 hours';
        action_delay_hours = 2;
        ai_explanation =
          'Pattern reflects transient processing errors. Retrying after cool-down period to ensure optimal issuer switch availability.';
    }
  }

  return {
    failure_category: classification.category,
    failure_category_label: classification.label,
    confidence_score: classification.confidence,
    recovery_probability: scoring.recovery_probability,
    priority: scoring.priority,
    priority_score: scoring.priority_score,
    recommended_action,
    recommended_action_label,
    action_delay_hours,
    ai_explanation,
    decision_factors: scoring.decision_factors,
    guardrail_note: guardrailCheck.reason,
  };
}
