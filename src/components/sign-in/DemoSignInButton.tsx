'use client';
import type { DemoMode } from '@/libs/demoSignIn';
import { DemoSignInButtons } from './DemoSignInButtons';

export function DemoSignInButton({
  returnTo,
  label = '체험 계정으로 입찰하기',
  mode = 'buyer',
}: {
  returnTo?: string;
  label?: string;
  mode?: DemoMode;
}) {
  return <DemoSignInButtons choices={[{ mode, label, returnTo }]} />;
}
