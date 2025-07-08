import { Suspense } from 'react';
import {
  MyPurchasesContent,
  MyPurchasesContentSkeleton,
} from '@/components/mypage';

export default async function MyPurchasesPage() {
  return (
    <div className='p-4'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>참여한 거래</h1>
      </div>

      <Suspense fallback={<MyPurchasesContentSkeleton />}>
        <MyPurchasesContent />
      </Suspense>
    </div>
  );
}
