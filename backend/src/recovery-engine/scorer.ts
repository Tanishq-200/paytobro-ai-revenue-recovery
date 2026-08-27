import { DecisionFactors, FailureCategory, PaymentMethod, PriorityLevel } from '../types/index.js';

export interface ScoringResult {
  recovery_probability: number;
  priority: PriorityLevel;
  priority_score: number;
  decision_factors: DecisionFactors;
}

export function calculateRecoveryScore(params: {
  category: FailureCategory;
  customerReliability: number; // 0 - 100
  attemptCount: number;
  paymentMethod: PaymentMethod;
  amount: number;
}): ScoringResult {
  const { category, customerReliability, attemptCount, paymentMethod, amount } = params;

  // Base recovery probability by failure category
  let categoryBaseScore = 80;
  switch (category) {
    case 'temporary_bank_decline':
      categoryBaseScore = 88;
      break;
    case 'network_timeout':
      categoryBaseScore = 90;
      break;
    case 'card_expired':
      categoryBaseScore = 78;
      break;
    case 'insufficient_funds':
      categoryBaseScore = 74;
      break;
    case 'auth_failed_3ds':
      categoryBaseScore = 70;
      break;
    case 'mandate_decline':
      categoryBaseScore = 62;
      break;
    case 'account_frozen':
      categoryBaseScore = 8;
      break;
  }

  // Payment method adjustment
  let methodMultiplier = 1.0;
  if (paymentMethod === 'UPI') methodMultiplier = 1.05; // UPI has highest retry pickup in India
  if (paymentMethod === 'NetBanking') methodMultiplier = 0.95;
  if (paymentMethod === 'Card') methodMultiplier = 1.02;

  // Attempt penalty: Each prior retry diminishes probability
  let attemptScore = 95;
  if (attemptCount === 1) attemptScore = 95;
  else if (attemptCount === 2) attemptScore = 68;
  else if (attemptCount >= 3) attemptScore = 32;

  // Customer reliability factor
  const customerFactor = Math.max(30, Math.min(99, customerReliability));

  // Weighted formula:
  // 35% category base, 30% customer history, 25% retry history, 10% payment method
  let weightedProb =
    0.35 * categoryBaseScore +
    0.30 * customerFactor +
    0.25 * attemptScore +
    0.10 * (categoryBaseScore * methodMultiplier);

  // Bounds
  let finalProbability = Math.round(Math.max(5, Math.min(96, weightedProb)));

  if (category === 'account_frozen') {
    finalProbability = 5;
  }

  // Priority formula:
  // Expected value to recover = Amount * (Probability / 100)
  // Plus urgency boost for high-ticket transactions
  const expectedValue = amount * (finalProbability / 100);
  const urgencyMultiplier = amount >= 20000 ? 1.25 : amount >= 10000 ? 1.1 : 1.0;
  const priorityScore = Math.round(expectedValue * urgencyMultiplier);

  let priority: PriorityLevel = 'low';
  if (priorityScore >= 16000 || (amount >= 20000 && finalProbability >= 70)) {
    priority = 'critical';
  } else if (priorityScore >= 7500 || (amount >= 10000 && finalProbability >= 60)) {
    priority = 'high';
  } else if (priorityScore >= 2000) {
    priority = 'normal';
  } else {
    priority = 'low';
  }

  const decision_factors: DecisionFactors = {
    payment_history: Math.round(customerFactor * 0.9 + 5),
    failure_type_score: Math.round(categoryBaseScore),
    retry_history_score: Math.round(attemptScore),
    customer_reliability: Math.round(customerFactor),
  };

  return {
    recovery_probability: finalProbability,
    priority,
    priority_score: priorityScore,
    decision_factors,
  };
}
