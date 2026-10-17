'use client';

import Link from 'next/link';
import { RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutError({ reset }: { reset: () => void }) {
  return (
    <div className='space-y-5 bg-white px-4 py-8'>
      <h1 className='text-xl font-bold'>결제 화면을 불러오지 못했습니다</h1>
      <p className='text-sm text-gray-700'>다시 연결한 후 결제 상태를 확인해 주세요.</p>
      <Button className='w-full rounded-lg' onClick={reset}><RotateCw aria-hidden='true' />다시 시도</Button>
      <Button asChild variant='outline' className='w-full rounded-lg'><Link href='/auctions'>경매 목록으로</Link></Button>
    </div>
  );
}
