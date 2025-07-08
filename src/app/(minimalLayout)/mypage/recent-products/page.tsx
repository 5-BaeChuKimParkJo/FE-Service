import { Suspense } from 'react';
import {
  MyRecentProductsContent,
  MyRecentProductsContentSkeleton,
} from '@/components/mypage';

export default async function MyRecentProductsPage() {
  return (
    <div className='p-4'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>최근본 상품</h1>
        <p className='text-gray-600'>내가 최근에 본 상품들을 확인하세요</p>
      </div>

      <Suspense fallback={<MyRecentProductsContentSkeleton />}>
        <MyRecentProductsContent />
      </Suspense>
    </div>
  );
}
