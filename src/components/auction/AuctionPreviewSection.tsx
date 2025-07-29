'use client';

import { useEffect, useState } from 'react';
import { P } from '@/components/ui';
import { AuctionPreviewCard } from './AuctionPreviewCard';
import { StatusBadge } from '@/components/icons';
import Link from 'next/link';
import { searchAuctions } from '@/actions/search-service';
import { SearchAuctionItem } from '@/types/auction/search-products';

export function AuctionPreviewSection() {
  const [liveAuctions, setLiveAuctions] = useState<SearchAuctionItem[]>([]);
  const [hotAuctions, setHotAuctions] = useState<SearchAuctionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);

        const liveResponse = await searchAuctions({
          auctionTitle: '',
          sortBy: 'latest',
          searchAfter: [],
        });

        const hotResponse = await searchAuctions({
          auctionTitle: '',
          sortBy: 'recommended',
          searchAfter: [],
        });

        setLiveAuctions(
          liveResponse.getAuctionSearchResponseVoList.slice(0, 10),
        );
        setHotAuctions(hotResponse.getAuctionSearchResponseVoList.slice(0, 10));
      } catch (error) {
        console.error('경매 데이터 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (loading) {
    return (
      <div className='space-y-6'>
        {/* 로딩 스켈레톤 */}
        <div className='flex gap-x-2'>
          <div className='w-10 h-5 bg-gray-300 rounded animate-pulse' />
          <div className='w-40 h-5 bg-gray-300 rounded animate-pulse' />
          <div className='flex-1' />
          <div className='w-12 h-4 bg-gray-300 rounded animate-pulse' />
        </div>
        <div className='flex flex-nowrap overflow-x-auto gap-x-2 scrollbar-hide -mx-4 px-4'>
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className='flex-shrink-0 w-full max-w-[250px] bg-gray-300 rounded-2xl h-[200px] animate-pulse'
            />
          ))}
        </div>
        <div className='flex gap-x-2'>
          <div className='w-10 h-5 bg-gray-300 rounded animate-pulse' />
          <div className='w-48 h-5 bg-gray-300 rounded animate-pulse' />
          <div className='flex-1' />
          <div className='w-12 h-4 bg-gray-300 rounded animate-pulse' />
        </div>
        <div className='flex flex-nowrap overflow-x-auto gap-x-2 scrollbar-hide -mx-4 px-4'>
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className='flex-shrink-0 w-full max-w-[250px] bg-gray-300 rounded-2xl h-[200px] animate-pulse'
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='overflow-x-hidden'>
      {/* 현재 입찰중인 상품 섹션 */}
      <div className='flex gap-x-2'>
        <StatusBadge variant='red' size='sm'>
          LIVE
        </StatusBadge>
        <P size='base' weight='bold' color='secondary'>
          전체 경매 상품
        </P>
        <Link
          href='/auctions?auctionTitle=&sortBy=latest&status=active'
          className='flex justify-end items-end flex-1'
        >
          <P size='xs' weight='bold' color='secondary'>
            모두 보기
          </P>
        </Link>
      </div>
      <section className='flex flex-nowrap overflow-x-auto gap-x-2 scrollbar-hide -mx-4 px-4'>
        {liveAuctions.map((auction) => (
          <AuctionPreviewCard key={auction.auctionUuid} auction={auction} />
        ))}
      </section>

      <div className='flex gap-x-2'>
        <StatusBadge variant='orange' size='sm'>
          HOT
        </StatusBadge>
        <P size='base' weight='bold' color='secondary'>
          이번주 가장 관심을 많이 받은 상품
        </P>
        <Link
          href='/auctions?auctionTitle=&sortBy=recommended'
          className='flex justify-end items-end flex-1'
        >
          <P size='xs' weight='bold' color='secondary'>
            모두 보기
          </P>
        </Link>
      </div>
      <section className='flex flex-nowrap overflow-x-auto gap-x-2 scrollbar-hide -mx-4 px-4'>
        {hotAuctions.map((auction) => (
          <AuctionPreviewCard key={auction.auctionUuid} auction={auction} />
        ))}
      </section>
    </div>
  );
}
