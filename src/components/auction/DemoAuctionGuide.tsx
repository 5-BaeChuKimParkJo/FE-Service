'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  isDemo?: boolean;
  auctionUuid: string;
  startAt: string;
  endAt: string;
  status: 'waiting' | 'active' | 'ended';
};

export function DemoAuctionGuide({
  isDemo,
  auctionUuid,
  startAt,
  endAt,
  status,
}: Props) {
  const router = useRouter();
  const refreshed = useRef<string | null>(null);
  const [checking, setChecking] = useState<string | null>(null);
  const deadline = Date.parse(status === 'waiting' ? startAt : endAt);
  const checkKey = `${auctionUuid}:${status}:${deadline}`;

  useEffect(() => {
    if (
      !isDemo ||
      status === 'ended' ||
      !Number.isFinite(deadline) ||
      refreshed.current === checkKey
    )
      return;
    const delay = Math.max(0, deadline - Date.now() + 1000);
    if (delay > 2147483647) return;
    const timer = window.setTimeout(() => {
      refreshed.current = checkKey;
      setChecking(checkKey);
      router.refresh();
    }, delay);
    return () => window.clearTimeout(timer);
  }, [isDemo, status, deadline, checkKey, router]);

  if (isDemo !== true) return null;

  const minutes = (Date.parse(endAt) - Date.parse(startAt)) / 60000;
  const duration =
    minutes === 5
      ? '5분 '
      : minutes === 30
        ? '30분 '
        : minutes === 1440
          ? '24시간 '
          : '';
  const ended = status === 'ended';
  const currentStep = ended ? 2 : checking === checkKey ? 1 : 0;
  const steps = ['입찰하기', '마감 · 낙찰 확인', '낙찰자 테스트 결제'];

  return (
    <section
      className='mx-4 my-4 rounded-2xl border border-violet-200 bg-violet-50 p-5 text-gray-900'
      aria-label='체험 경매 안내'
    >
      <p className='mb-2 text-xs font-semibold tracking-wide text-violet-700'>
        PORTFOLIO DEMO
      </p>
      <h2 className='text-lg font-bold'>{duration}체험 경매</h2>
      <p className='mt-2 text-sm leading-6 text-gray-700'>
        입찰부터 낙찰자 테스트 결제까지 체험할 수 있습니다. 실제 배송이나 거래는
        제공하지 않습니다.
      </p>
      <ol className='my-4 grid grid-cols-3 gap-2 text-xs leading-5'>
        {steps.map((step, index) => (
          <li
            key={step}
            aria-current={currentStep === index ? 'step' : undefined}
            className={`rounded-lg border px-2 py-3 ${currentStep === index ? 'border-violet-400 bg-white font-semibold text-violet-800' : 'border-violet-100 text-gray-600'}`}
          >
            <span className='mb-1 block text-[10px]'>STEP {index + 1}</span>
            {step}
          </li>
        ))}
      </ol>
      <p className='text-sm font-medium' role='status'>
        {ended
          ? '경매가 마감되었습니다. 낙찰자만 아래에서 테스트 결제를 진행할 수 있습니다.'
          : checking === checkKey
            ? '서버에서 경매 결과를 확인하고 있습니다. 결과가 보이지 않으면 새로고침해 주세요.'
            : status === 'waiting'
              ? '경매 시작을 기다리고 있습니다.'
              : '경매 진행 중입니다. 입찰 후 마감까지 기다려 주세요.'}
      </p>
      <p className='mt-2 text-xs leading-5 text-gray-600'>
        체험 계정은 여러 방문자가 공유합니다. 이미 최고 입찰자라면 연속 입찰이
        제한될 수 있습니다. 결제는 Toss 테스트 환경입니다.
      </p>
      <button
        type='button'
        onClick={() => router.refresh()}
        className='mt-3 rounded-lg border border-violet-200 bg-white px-3 py-2 text-xs font-medium text-violet-800'
      >
        결과 새로고침
      </button>
    </section>
  );
}
