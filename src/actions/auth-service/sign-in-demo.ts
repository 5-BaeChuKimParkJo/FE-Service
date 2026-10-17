'use server';

import { signIn } from './sign-in';

export async function signInDemo(): Promise<{ ok: true }> {
  const memberId = process.env.DEMO_MEMBER_ID;
  const password = process.env.DEMO_MEMBER_PASSWORD;
  if (!memberId || !password) {
    throw new Error('Demo sign-in is unavailable');
  }

  await signIn(memberId, password);
  return { ok: true };
}
