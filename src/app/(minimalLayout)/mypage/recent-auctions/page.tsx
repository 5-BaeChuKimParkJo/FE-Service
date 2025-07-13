import { Suspense } from 'react';
import {
  MyRecentAuctionsContent,
  MyRecentAuctionsContentSkeleton,
} from './components';

export default async function MyRecentAuctionsPage() {
  return (
    <div className='p-4'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>최근본 경매</h1>
        <p className='text-gray-600'>내가 최근에 본 경매들을 확인하세요</p>
      </div>

      <Suspense fallback={<MyRecentAuctionsContentSkeleton />}>
        <MyRecentAuctionsContent />
      </Suspense>
    </div>
  );
}
