import Link from 'next/link';
import { Heart } from 'lucide-react';

export function MyLikedProductsContent() {
  return (
    <div className='text-center py-16'>
      <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
        <Heart className='w-10 h-10 text-gray-400' />
      </div>
      <h3 className='text-lg font-semibold text-gray-700 mb-2'>
        찜한 상품이 없습니다
      </h3>
      <p className='text-sm text-gray-500 mb-6'>
        마음에 드는 상품을 찜해보세요!
      </p>
      <Link
        href='/auctions'
        className='inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors'
      >
        상품 둘러보기
      </Link>
    </div>
  );
}
