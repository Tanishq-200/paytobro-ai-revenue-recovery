export const defaultGuardrails = {
    max_retry_attempts: 3,
    cooldown_hours: 2,
    min_recovery_probability_threshold: 15,
    stop_on_permanent_failure: true,
    mask_sensitive_data: true,
    demo_mode_active: true,
};
export function evaluateGuardrails(category, attemptCount, probability, config = defaultGuardrails) {
    // Rule 1: Never retry indefinitely; stop after max attempts
    if (attemptCount >= config.max_retry_attempts) {
        return {
            allowed: false,
            reason: `Maximum retry threshold (${config.max_retry_attempts}) reached. Further automated retries halted to prevent customer friction.`,
            enforcedAction: 'contact_customer',
        };
    }
    // Rule 2: Avoid retries for permanent failures
    if (config.stop_on_permanent_failure && category === 'account_frozen') {
        return {
            allowed: false,
            reason: 'Permanent failure detected (Account Frozen / Risk Flag). Retrying is strictly prohibited.',
            enforcedAction: 'do_nothing',
        };
    }
    // Rule 3: Low probability threshold
    if (probability < config.min_recovery_probability_threshold) {
        return {
            allowed: false,
            reason: `Calculated recovery probability (${probability}%) is below minimum safe threshold (${config.min_recovery_probability_threshold}%).`,
            enforcedAction: 'contact_customer',
        };
    }
    return {
        allowed: true,
    };
}
export function maskSensitiveValue(value) {
    if (!value)
        return '';
    if (value.includes('@')) {
        // Mask email: r***l@example.com
        const [user, domain] = value.split('@');
        if (user.length <= 2)
            return `${user[0]}*@${domain}`;
        return `${user[0]}${'*'.repeat(user.length - 2)}${user[user.length - 1]}@${domain}`;
    }
    if (value.length >= 10) {
        // Mask phone / card: ******9281
        return `******${value.slice(-4)}`;
    }
    return value;
}
