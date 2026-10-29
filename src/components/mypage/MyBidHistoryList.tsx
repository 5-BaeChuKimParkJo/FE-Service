'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Search } from 'lucide-react';
import {
  selectBidHistory,
  type BidHistoryFilter,
  type BidHistoryGroup,
} from '@/libs/bidHistory';
import { MyBidHistoryCard } from './MyBidHistoryCard';

export function MyBidHistoryList({ groups }: { groups: BidHistoryGroup[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<BidHistoryFilter['status']>('all');
  const [sort, setSort] = useState<BidHistoryFilter['sort']>('recent');
  const visible = useMemo(
    () => selectBidHistory(groups, { query, status, sort }),
    [groups, query, status, sort],
  );
  const resetFilters = () => {
    setQuery('');
    setStatus('all');
    setSort('recent');
  };
  const totalBids = groups.reduce((count, group) => count + group.bidCount, 0);
  const ended = groups.filter((group) => group.status === 'ended').length;
  return (
    <section aria-label='내 입찰 내역' className='space-y-4'>
      <dl className='grid grid-cols-3 divide-x divide-gray-100 rounded-xl border border-gray-200 bg-white py-4 text-center'>
        {[
          ['참여 경매', groups.length],
          ['입찰 횟수', totalBids],
          ['종료 경매', ended],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className='text-xs text-gray-500'>{label}</dt>
            <dd className='mt-1 text-xl font-semibold tabular-nums text-gray-900'>
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <div className='rounded-xl border border-gray-200 bg-white p-4'>
        <label
          htmlFor='history-search'
          className='mb-2 block text-xs font-medium text-gray-600'
        >
          경매 제목 검색
        </label>
        <div className='relative'>
          <Search
            aria-hidden='true'
            className='absolute left-3 top-3.5 h-4 w-4 text-gray-400'
          />
          <input
            id='history-search'
            type='search'
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='참여한 경매 검색'
            className='min-h-11 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-primary-200 focus:ring-1 focus:ring-primary-200'
          />
        </div>
        <div className='mt-3 grid grid-cols-2 gap-3'>
          <div>
            <label
              htmlFor='history-status'
              className='mb-2 block text-xs font-medium text-gray-600'
            >
              경매 상태
            </label>
            <select
              id='history-status'
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as BidHistoryFilter['status'])
              }
              className='min-h-11 w-full rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700'
            >
              <option value='all'>전체</option>
              <option value='active'>진행중</option>
              <option value='ended'>종료</option>
              <option value='waiting'>대기중</option>
              <option value='cancelled'>취소됨</option>
            </select>
          </div>
          <div>
            <label
              htmlFor='history-sort'
              className='mb-2 block text-xs font-medium text-gray-600'
            >
              정렬
            </label>
            <select
              id='history-sort'
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as BidHistoryFilter['sort'])
              }
              className='min-h-11 w-full rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-700'
            >
              <option value='recent'>최근 입찰순</option>
              <option value='amount'>내 입찰가 높은순</option>
            </select>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-between gap-2'>
        <p role='status' aria-live='polite' className='text-sm text-gray-500'>
          {visible.length}개 경매 표시
        </p>
        <button
          type='button'
          disabled={pending}
          aria-busy={pending}
          onClick={() => startTransition(() => router.refresh())}
          className='flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50'
        >
          <RefreshCw
            aria-hidden='true'
            className={`h-3.5 w-3.5 ${pending ? 'animate-spin' : ''}`}
          />
          {pending ? '불러오는 중' : '새로고침'}
        </button>
      </div>
      {visible.length ? (
        <ul className='space-y-4' aria-label='참여 경매 목록'>
          {visible.map((group) => (
            <li key={group.auctionUuid}>
              <MyBidHistoryCard group={group} />
            </li>
          ))}
        </ul>
      ) : (
        <div className='rounded-xl border border-dashed border-gray-300 bg-white px-4 py-10 text-center'>
          <h2 className='text-sm font-semibold text-gray-800'>
            조건에 맞는 경매가 없습니다
          </h2>
          <p className='mt-2 text-sm text-gray-500'>
            검색어와 상태 필터를 바꿔보세요.
          </p>
          <button
            type='button'
            onClick={resetFilters}
            className='mt-3 min-h-11 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700'
          >
            조건 초기화
          </button>
        </div>
      )}
      <p className='px-1 text-xs leading-5 text-gray-500'>
        조회한 입찰 기록 기준입니다. 낙찰 여부와 결제 상태는 경매 상세에서
        확인해 주세요. 상태가 바뀌면 새로고침해 주세요.
      </p>
    </section>
  );
}
