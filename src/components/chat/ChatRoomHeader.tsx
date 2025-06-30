import Image from 'next/image';
import { ChevronLeft, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { formatNumber } from '@/utils/format';

// TODO: props로 데이터 받도록 수정 필요
const DUMMY_DATA = {
  opponentNickname: '캐딧',
  opponentTemperature: 49.2,
  product: {
    id: 'dummy-product-123',
    title: '에이블루 커블체어 와이더',
    price: 9000,
    imageUrl: '/images/dummy/dummy2.png', // 예시 이미지 경로
  },
};

export function ChatRoomHeader() {
  const { opponentNickname, opponentTemperature, product } = DUMMY_DATA;

  return (
    <header className='sticky top-0 z-10 bg-white shadow-sm'>
      <div className='flex h-16 items-center justify-between border-b px-4'>
        <div className='flex items-center gap-2'>
          <Link href='/chat' passHref>
            <button aria-label='뒤로가기' className='p-2'>
              <ChevronLeft className='h-6 w-6' />
            </button>
          </Link>
          <h2 className='text-lg font-bold'>{opponentNickname}</h2>
          <p className='text-base font-bold text-primary-100'>
            {opponentTemperature} 멋진 거래자
          </p>
        </div>
        <div className='flex items-center'>
          <button aria-label='더보기' className='p-2'>
            <MoreVertical className='h-5 w-5' />
          </button>
        </div>
      </div>

      <section aria-labelledby='product-info-heading'>
        <h2 id='product-info-heading' className='sr-only'>
          거래 상품 정보
        </h2>
        <Link
          href={`/products/${product.id}`}
          className='flex items-center gap-4 border-b px-4 py-2 transition-colors hover:bg-gray-50'
        >
          <div className='relative h-16 w-16 flex-shrink-0'>
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className='rounded-md object-cover'
            />
          </div>
          <div className='flex flex-col justify-center'>
            <span className='text-sm text-gray-500'>판매중</span>
            <h3 className='font-semibold'>{product.title}</h3>
            <p className='text-lg font-bold'>{`${formatNumber(
              product.price,
            )}원`}</p>
          </div>
        </Link>
      </section>
    </header>
  );
}
