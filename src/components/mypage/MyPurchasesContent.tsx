import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

// interface MyPurchasesContentProps {
//   purchases: BidHistory[];
// }

export function MyPurchasesContent() {
  return (
    <div className='text-center py-16'>
      <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
        <ShoppingCart className='w-10 h-10 text-gray-400' />
      </div>
      <h3 className='text-lg font-semibold text-gray-700 mb-2'>
        참여한 거래가 없습니다
      </h3>
      <p className='text-sm text-gray-500 mb-6'>
        관심있는 상품에 입찰해보세요!
      </p>
      <Link
        href='/auctions'
        className='inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors'
      >
        경매 둘러보기
      </Link>
    </div>
  );
}
