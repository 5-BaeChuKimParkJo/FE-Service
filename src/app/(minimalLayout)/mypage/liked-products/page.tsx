import { Suspense } from 'react';
import {
  MyLikedProductsContent,
  MyLikedProductsContentSkeleton,
} from '@/components/mypage';

export default async function MyLikedProductsPage() {
  return (
    <div className='p-4'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>찜한 상품</h1>
        <p className='text-gray-600'>내가 관심있어 하는 상품들을 확인하세요</p>
      </div>

      <Suspense fallback={<MyLikedProductsContentSkeleton />}>
        <MyLikedProductsContent />
      </Suspense>
    </div>
  );
}
