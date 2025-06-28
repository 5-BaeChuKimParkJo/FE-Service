import { P } from '@/components/ui';
import { AuctionPreviewCard } from './AuctionPreviewCard';
import { StatusBadge } from '@/components/icons';
import Link from 'next/link';

export function AuctionPreviewSection() {
  return (
    <>
      {/* 현재 입찰중인 상품 섹션 */}
      <div className='flex gap-x-2'>
        <StatusBadge variant='red' size='sm'>
          LIVE
        </StatusBadge>
        <P size='base' weight='bold' color='secondary'>
          현재 입찰 진행 중인 상품
        </P>
        <Link href='/auctions' className='flex justify-end items-end flex-1'>
          <P size='xs' weight='bold' color='secondary'>
            모두 보기
          </P>
        </Link>
      </div>
      <section className='flex flex-nowrap overflow-x-auto gap-x-2 scrollbar-hide -mx-4 px-4'>
        {Array.from({ length: 2 }).map((_, index) => (
          <AuctionPreviewCard key={index} number={index + 1} />
        ))}
      </section>
      {/* 관심 상품 섹션 */}
      <div className='flex gap-x-2'>
        <StatusBadge variant='orange' size='sm'>
          HOT
        </StatusBadge>
        <P size='base' weight='bold' color='secondary'>
          이번주 가장 관심을 많이 받은 상품
        </P>
        <Link href='/auctions' className='flex justify-end items-end flex-1'>
          <P size='xs' weight='bold' color='secondary'>
            모두 보기
          </P>
        </Link>
      </div>
      <section className='flex flex-nowrap overflow-x-auto gap-x-2 scrollbar-hide -mx-4 px-4'>
        {Array.from({ length: 2 }).map((_, index) => (
          <AuctionPreviewCard key={index} number={index + 3} />
        ))}
      </section>
    </>
  );
}
