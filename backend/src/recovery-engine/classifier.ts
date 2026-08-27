import { FailureCategory } from '../types/index.js';

export interface ClassificationResult {
  category: FailureCategory;
  label: string;
  confidence: number; // 0 - 100
  is_recoverable: boolean;
  explanation: string;
}

export function classifyFailure(reason: string, code: string): ClassificationResult {
  const normalized = (reason + ' ' + code).toLowerCase();

  // Permanent failures
  if (
    normalized.includes('fraud') ||
    normalized.includes('stolen') ||
    normalized.includes('account_frozen') ||
    normalized.includes('account_blocked') ||
    normalized.includes('blacklisted')
  ) {
    return {
      category: 'account_frozen',
      label: 'Account Blocked / Risk Alert',
      confidence: 96,
      is_recoverable: false,
      explanation: 'Issuer or fraud detection system locked the account or flagged high risk. Guardrails forbid automated retries.',
    };
  }

  // Temporary Bank / Issuer declines
  if (
    normalized.includes('bank_technical_error') ||
    normalized.includes('issuer_down') ||
    normalized.includes('declined_by_bank') ||
    normalized.includes('bank downtime') ||
    normalized.includes('temporary bank failure') ||
    normalized.includes('issuer_unavailable') ||
    normalized.includes('switch_unavailable') ||
    normalized.includes('npci_down')
  ) {
    return {
      category: 'temporary_bank_decline',
      label: 'Temporary Bank Failure',
      confidence: 94,
      is_recoverable: true,
      explanation: 'Temporary bank switch unavailability or core banking host timeout. Highly recoverable once host recovers.',
    };
  }

  // Insufficient balance
  if (
    normalized.includes('insufficient') ||
    normalized.includes('low_balance') ||
    normalized.includes('credit_limit') ||
    normalized.includes('balance')
  ) {
    return {
      category: 'insufficient_funds',
      label: 'Insufficient Funds',
      confidence: 91,
      is_recoverable: true,
      explanation: 'Customer account had inadequate balance at checkout time. Recoverable via timed notification/reminder.',
    };
  }

  // Expired Card
  if (
    normalized.includes('expired') ||
    normalized.includes('card_expired') ||
    normalized.includes('validity') ||
    normalized.includes('invalid_expiry')
  ) {
    return {
      category: 'card_expired',
      label: 'Expired Card',
      confidence: 98,
      is_recoverable: true,
      explanation: 'Payment card has passed expiration date. Directly recoverable by offering instant 1-click alternative method.',
    };
  }

  // 3DS / Authentication failure
  if (
    normalized.includes('3ds') ||
    normalized.includes('otp') ||
    normalized.includes('mpin') ||
    normalized.includes('auth_failed') ||
    normalized.includes('authentication')
  ) {
    return {
      category: 'auth_failed_3ds',
      label: '3DS / Authentication Drop',
      confidence: 89,
      is_recoverable: true,
      explanation: 'Customer dropped off at OTP or entered incorrect MPIN. Recoverable via re-prompting authentication.',
    };
  }

  // Network / Gateway timeout
  if (
    normalized.includes('timeout') ||
    normalized.includes('network') ||
    normalized.includes('connection') ||
    normalized.includes('gateway_timeout')
  ) {
    return {
      category: 'network_timeout',
      label: 'Network / Gateway Timeout',
      confidence: 92,
      is_recoverable: true,
      explanation: 'Packet drop or gateway socket timeout during processing. Immediate or short-delay retry has high success.',
    };
  }

  // Mandate / Subscription failure
  if (
    normalized.includes('mandate') ||
    normalized.includes('subscription') ||
    normalized.includes('e-mandate')
  ) {
    return {
      category: 'mandate_decline',
      label: 'E-Mandate Decline',
      confidence: 87,
      is_recoverable: true,
      explanation: 'Recurring debit mandate execution failed or hit monthly cycle limit. Recoverable via ad-hoc backup charge.',
    };
  }

  // Default fallback to temporary bank decline
  return {
    category: 'temporary_bank_decline',
    label: 'Temporary Bank Failure',
    confidence: 84,
    is_recoverable: true,
    explanation: 'Unspecified decline code exhibiting issuer-side rejection patterns.',
  };
}
