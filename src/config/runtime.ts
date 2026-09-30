export function getDemoVerificationCode(mode: string | undefined): string | null {
  return mode === 'homelab' ? '000000' : null;
}
