import { Suspense } from 'react';

import { getMyBidHistory } from '@/actions/auction-service';
import { MyPurchasesContent } from './_components/MyPurchasesContent';
import { MyPurchasesContentSkeleton } from './_components/MyPurchasesContentSkeleton';

export default async function MyPurchasesPage() {
  const bidHistory = await getMyBidHistory();

  return (
    <div className='p-4'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>참여한 거래</h1>
      </div>

      <Suspense fallback={<MyPurchasesContentSkeleton />}>
        <MyPurchasesContent bidHistory={bidHistory} />
      </Suspense>
    </div>
  );
}
