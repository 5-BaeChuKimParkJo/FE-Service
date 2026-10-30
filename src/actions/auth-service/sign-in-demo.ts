'use server';

import { signIn } from './sign-in';
import { getDemoModes } from '@/libs/demoSignIn';

export async function signInDemo(
  mode: unknown = 'buyer',
): Promise<{ ok: true }> {
  if (
    (mode !== 'buyer' && mode !== 'seller') ||
    !getDemoModes(process.env).includes(mode)
  ) {
    throw new Error('Demo sign-in is unavailable');
  }
  const memberId =
    mode === 'seller'
      ? process.env.DEMO_SELLER_MEMBER_ID
      : process.env.DEMO_MEMBER_ID;
  const password =
    mode === 'seller'
      ? process.env.DEMO_SELLER_MEMBER_PASSWORD
      : process.env.DEMO_MEMBER_PASSWORD;
  if (!memberId || !password) throw new Error('Demo sign-in is unavailable');
  try {
    await signIn(memberId, password);
  } catch {
    throw new Error('Demo sign-in is unavailable');
  }
  return { ok: true };
}
