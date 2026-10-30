import Link from 'next/link';
import { getDemoModes } from '@/libs/demoSignIn';
import { DemoSignInButtons } from './DemoSignInButtons';

export function DemoSignInOptions({
  buyerLabel = '구매자 체험 계정으로 시작하기',
  showLoginFallback = false,
}: {
  buyerLabel?: string;
  showLoginFallback?: boolean;
}) {
  const modes = getDemoModes(process.env);
  if (!modes.length)
    return showLoginFallback ? (
      <Link
        href='/sign-in'
        className='text-sm font-semibold text-gray-900 underline'
      >
        로그인
      </Link>
    ) : null;
  return (
    <section aria-label='포트폴리오 체험' className='space-y-3'>
      <DemoSignInButtons
        choices={modes.map((mode) => ({
          mode,
          label:
            mode === 'seller' ? '판매자 체험 계정으로 시작하기' : buyerLabel,
          description:
            mode === 'seller'
              ? '내 출품과 경매 진행 상황 확인'
              : '경매 탐색과 입찰 체험',
        }))}
      />
      <p className='text-xs leading-5 text-gray-500'>
        공유 계정으로 체험합니다. 실제 상품 배송이나 거래는 제공하지 않습니다.
      </p>
    </section>
  );
}
