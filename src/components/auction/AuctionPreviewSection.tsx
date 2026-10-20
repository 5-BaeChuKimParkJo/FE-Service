'use client';

import { useQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { searchAuctions } from '@/actions/search-service';
import { getPopularAuctions } from '@/actions/auction-service/get-popular-auctions';
import { StatusBadge } from '@/components/icons';
import { AuctionPreviewCard } from './AuctionPreviewCard';
import { PopularAuctionCard } from './PopularAuctionCard';

const RANKING_REFRESH_MS = 5 * 60 * 1000;
const rowClassName = 'flex gap-2 overflow-x-auto pb-2 scrollbar-hide';

function LoadingAuctions({ label }: { label: string }) {
  return (
    <div role='status' aria-label={label} className={rowClassName}>
      {[0, 1].map((index) => (
        <div
          key={index}
          aria-hidden='true'
          className='h-[260px] w-[250px] max-w-full shrink-0 animate-pulse rounded-[8px] bg-gray-200'
        />
      ))}
    </div>
  );
}

function AuctionLoadError({
  message,
  retryLabel,
  retry,
  isFetching,
}: {
  message: string;
  retryLabel: string;
  retry: () => void;
  isFetching: boolean;
}) {
  return (
    <div
      role='alert'
      className='flex flex-wrap items-center gap-2 py-4 text-sm text-gray-600'
    >
      <p>{message}</p>
      <button
        type='button'
        onClick={retry}
        disabled={isFetching}
        aria-label={retryLabel}
        className='inline-flex min-h-9 items-center gap-1 rounded-[8px] border border-gray-300 px-3 py-1 text-gray-900 hover:bg-gray-50 disabled:opacity-50'
      >
        <RefreshCw
          className={`size-4 ${isFetching ? 'animate-spin' : ''}`}
          aria-hidden='true'
        />
        다시 불러오기
      </button>
    </div>
  );
}

export function AuctionPreviewSection() {
  const latest = useQuery({
    queryKey: ['auction-previews', 'latest'],
    queryFn: () =>
      searchAuctions({ auctionTitle: '', sortBy: 'latest', searchAfter: [] }),
    retry: false,
  });
  const popular = useQuery({
    queryKey: ['auctions', 'popular'],
    queryFn: getPopularAuctions,
    staleTime: RANKING_REFRESH_MS,
    refetchInterval: RANKING_REFRESH_MS,
    retry: false,
  });

  return (
    <div className='space-y-6 overflow-x-hidden'>
      <section aria-labelledby='latest-auctions-heading' className='space-y-3'>
        <div className='flex flex-wrap items-center gap-2'>
          <StatusBadge variant='red' size='sm'>
            LIVE
          </StatusBadge>
          <h2
            id='latest-auctions-heading'
            className='text-base font-bold text-gray-900'
          >
            전체 경매 상품
          </h2>
          <Link
            href='/auctions?auctionTitle=&sortBy=latest&status=active'
            className='ml-auto text-xs font-bold text-gray-900'
          >
            모두 보기
          </Link>
        </div>
        {latest.isPending && <LoadingAuctions label='최신 경매 불러오는 중' />}
        {latest.isError && (
          <AuctionLoadError
            message='최신 경매를 불러오지 못했습니다.'
            retryLabel='최신 경매 다시 불러오기'
            retry={() => void latest.refetch()}
            isFetching={latest.isFetching}
          />
        )}
        {latest.data &&
          (latest.data.getAuctionSearchResponseVoList.length ? (
            <div className={rowClassName}>
              {latest.data.getAuctionSearchResponseVoList
                .slice(0, 10)
                .map((auction) => (
                  <AuctionPreviewCard
                    key={auction.auctionUuid}
                    auction={auction}
                  />
                ))}
            </div>
          ) : (
            <p className='py-6 text-sm text-gray-500'>
              등록된 경매가 없습니다.
            </p>
          ))}
      </section>

      <section aria-labelledby='popular-auctions-heading' className='space-y-3'>
        <div className='flex flex-wrap items-center gap-2'>
          <StatusBadge variant='orange' size='sm'>
            HOT
          </StatusBadge>
          <h2
            id='popular-auctions-heading'
            className='text-base font-bold text-gray-900'
          >
            최근 24시간 인기 경매 TOP 10
          </h2>
        </div>
        {popular.data?.generatedAt && (
          <p className='text-xs text-gray-500'>
            업데이트{' '}
            <time dateTime={popular.data.generatedAt}>
              {new Date(popular.data.generatedAt).toLocaleString('ko-KR', {
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </time>
          </p>
        )}
        {popular.isPending && <LoadingAuctions label='인기 경매 불러오는 중' />}
        {popular.isError && (
          <AuctionLoadError
            message='인기 경매를 불러오지 못했습니다.'
            retryLabel='인기 경매 다시 불러오기'
            retry={() => void popular.refetch()}
            isFetching={popular.isFetching}
          />
        )}
        {popular.data &&
          (popular.data.items.length ? (
            <ol className={rowClassName}>
              {popular.data.items.slice(0, 10).map((auction) => (
                <PopularAuctionCard
                  key={auction.auctionUuid}
                  auction={auction}
                />
              ))}
            </ol>
          ) : (
            <p className='py-6 text-sm text-gray-500'>
              아직 인기 경매가 없습니다.
            </p>
          ))}
      </section>
    </div>
  );
}
