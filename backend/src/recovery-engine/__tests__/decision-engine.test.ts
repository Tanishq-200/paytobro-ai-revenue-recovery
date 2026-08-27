import { test, describe } from 'node:test';
import assert from 'node:assert';
import { classifyFailure } from '../classifier.js';
import { calculateRecoveryScore } from '../scorer.js';
import { evaluateGuardrails, defaultGuardrails } from '../guardrails.js';
import { evaluatePaymentRecovery } from '../decision-engine.js';

describe('PayToBro Recovery Engine Tests', () => {
  test('classifyFailure correctly categorizes temporary bank failures', () => {
    const res = classifyFailure('Bank technical error occurred at switch', 'BANK_TECHNICAL_ERROR');
    assert.strictEqual(res.category, 'temporary_bank_decline');
    assert.strictEqual(res.is_recoverable, true);
    assert.ok(res.confidence >= 85);
  });

  test('classifyFailure identifies permanent fraud/frozen accounts as unrecoverable', () => {
    const res = classifyFailure('Account blocked due to suspected fraud', 'ACCOUNT_BLOCKED');
    assert.strictEqual(res.category, 'account_frozen');
    assert.strictEqual(res.is_recoverable, false);
    assert.ok(res.confidence >= 90);
  });

  test('classifyFailure identifies expired cards', () => {
    const res = classifyFailure('Card expired please use another card', 'EXPIRED_CARD');
    assert.strictEqual(res.category, 'card_expired');
    assert.strictEqual(res.is_recoverable, true);
  });

  test('calculateRecoveryScore calculates high probability for reliable customer on first failure', () => {
    const res = calculateRecoveryScore({
      category: 'temporary_bank_decline',
      customerReliability: 90,
      attemptCount: 1,
      paymentMethod: 'UPI',
      amount: 25000,
    });

    assert.ok(res.recovery_probability >= 80, `Expected prob >= 80, got ${res.recovery_probability}`);
    assert.strictEqual(res.priority, 'critical');
    assert.ok(res.decision_factors.payment_history > 70);
  });

  test('calculateRecoveryScore severely penalizes permanent failure', () => {
    const res = calculateRecoveryScore({
      category: 'account_frozen',
      customerReliability: 85,
      attemptCount: 1,
      paymentMethod: 'Card',
      amount: 5000,
    });

    assert.ok(res.recovery_probability <= 15, `Expected prob <= 15, got ${res.recovery_probability}`);
  });

  test('evaluateGuardrails prevents retries exceeding max retry limit', () => {
    const check = evaluateGuardrails('temporary_bank_decline', 3, 85, defaultGuardrails);
    assert.strictEqual(check.allowed, false);
    assert.strictEqual(check.enforcedAction, 'contact_customer');
  });

  test('evaluateGuardrails halts retries on account frozen / permanent fraud', () => {
    const check = evaluateGuardrails('account_frozen', 1, 5, defaultGuardrails);
    assert.strictEqual(check.allowed, false);
    assert.strictEqual(check.enforcedAction, 'do_nothing');
  });

  test('evaluatePaymentRecovery selects delayed retry for temporary bank declines', () => {
    const decision = evaluatePaymentRecovery({
      failureReason: 'Temporary bank switch downtime',
      failureCode: 'ISSUER_DOWN',
      amount: 4500,
      paymentMethod: 'UPI',
      attemptsCount: 1,
      customerReliability: 84,
    });

    assert.strictEqual(decision.failure_category, 'temporary_bank_decline');
    assert.strictEqual(decision.recommended_action, 'retry_delayed');
    assert.strictEqual(decision.action_delay_hours, 2);
    assert.ok(decision.confidence_score >= 90);
  });

  test('evaluatePaymentRecovery selects alternative payment method for expired cards', () => {
    const decision = evaluatePaymentRecovery({
      failureReason: 'Card has expired',
      failureCode: 'EXPIRED_CARD',
      amount: 18200,
      paymentMethod: 'Card',
      attemptsCount: 1,
      customerReliability: 78,
    });

    assert.strictEqual(decision.failure_category, 'card_expired');
    assert.strictEqual(decision.recommended_action, 'alt_payment_method');
  });
});
