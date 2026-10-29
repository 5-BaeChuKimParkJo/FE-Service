'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function MyPurchasesError({ reset }: { reset: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <section role='alert' className='px-6 py-16 text-center'>
      <h1 className='text-lg font-semibold text-gray-900'>
        거래 내역을 불러오지 못했습니다
      </h1>
      <p className='mt-3 text-sm leading-6 text-gray-500'>
        잠시 후 다시 시도해 주세요. 불러오기에 실패해도 기존 입찰 기록은
        사라지지 않습니다.
      </p>
      <Button
        className='mt-6 rounded-lg'
        isPending={pending}
        onClick={() =>
          startTransition(() => {
            router.refresh();
            reset();
          })
        }
      >
        다시 시도
      </Button>
    </section>
  );
}
