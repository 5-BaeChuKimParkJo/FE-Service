export type DemoMode = 'buyer' | 'seller';

export function getDemoModes(
  config: Record<string, string | undefined>,
): DemoMode[] {
  const modes: DemoMode[] = [];
  const buyer = config.DEMO_MEMBER_ID?.trim();
  const seller = config.DEMO_SELLER_MEMBER_ID?.trim();
  if (buyer && config.DEMO_MEMBER_PASSWORD?.trim()) modes.push('buyer');
  if (seller && config.DEMO_SELLER_MEMBER_PASSWORD?.trim() && seller !== buyer)
    modes.push('seller');
  return modes;
}

export function demoReturnTo(mode: DemoMode, path?: string): string {
  if (
    path?.startsWith('/') &&
    !path.startsWith('//') &&
    !/[\\\u0000-\u0020]/.test(path)
  )
    return path;
  return mode === 'seller' ? '/mypage/sales' : '/';
}
