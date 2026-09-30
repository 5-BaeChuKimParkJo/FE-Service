import { describe, expect, it } from 'vitest';
import { getDemoVerificationCode } from './runtime';

describe('getDemoVerificationCode', () => {
  it('shows the free code only in homelab mode', () => {
    expect(getDemoVerificationCode('homelab')).toBe('000000');
    expect(getDemoVerificationCode('production')).toBeNull();
    expect(getDemoVerificationCode(undefined)).toBeNull();
  });
});
