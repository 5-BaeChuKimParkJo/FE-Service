import { mySalesStatuses, mySalesUrl } from '@/libs/mySales';
import type { MySalesData, MySalesQuery } from '@/types/auction/my-sales';
import { MySaleCard } from './MySaleCard';

export function MySalesContent({
  data,
  query,
}: {
  data: MySalesData;
  query: MySalesQuery;
}) {
  const pages = Math.max(1, Math.min(10000, Math.ceil(data.total / 20)));
  return (
    <section aria-label='내 경매 현황' className='space-y-4'>
      <div>
        <p className='mb-2 text-xs text-gray-500'>내 경매 전체 기준</p>
        <dl className='grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-100'>
          {(
            [
              'total',
              'waiting',
              'active',
              'ended',
              'hidden',
              'cancelled',
            ] as const
          ).map((key) => {
            const label = key === 'total' ? '전체' : mySalesStatuses[key];
            return (
              <div key={key} className='bg-white px-2 py-3 text-center'>
                <dt className='text-xs text-gray-500'>{label}</dt>
                <dd
                  aria-label={label + ' 경매 수'}
                  className='mt-1 text-xl font-semibold tabular-nums text-gray-900'
                >
                  {data.summary[key].toLocaleString('ko-KR')}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
      <p role='status' className='text-sm text-gray-500'>
        검색 결과 {data.total.toLocaleString('ko-KR')}개 ·{' '}
        {query.page.toLocaleString('ko-KR')} / {pages.toLocaleString('ko-KR')}
        페이지
      </p>
      {data.items.length ? (
        <ul aria-label='내 경매 목록' className='space-y-4'>
          {data.items.map((item) => (
            <li key={item.auctionUuid}>
              <MySaleCard item={item} />
            </li>
          ))}
        </ul>
      ) : (
        <div className='rounded-xl border border-dashed border-gray-300 bg-white px-4 py-10 text-center'>
          <h2 className='font-semibold text-gray-800'>
            {data.summary.total === 0
              ? '아직 등록한 경매가 없습니다'
              : query.page > pages
                ? '이 페이지에는 경매가 없습니다'
                : '조건에 맞는 경매가 없습니다'}
          </h2>
          <p className='mt-2 text-sm text-gray-500'>
            {data.summary.total === 0
              ? '첫 경매를 등록해 보세요.'
              : '검색 조건을 바꾸거나 첫 페이지에서 다시 확인하세요.'}
          </p>
          <a
            href={
              data.summary.total === 0 ? '/auctions/create' : '/mypage/sales'
            }
            className='mt-4 inline-flex min-h-11 items-center rounded-lg bg-primary-200 px-4 text-sm font-medium text-white'
          >
            {data.summary.total === 0 ? '경매 등록하기' : '조건 초기화'}
          </a>
        </div>
      )}
      <nav
        aria-label='내 경매 페이지'
        className='flex flex-wrap items-center justify-between gap-2'
      >
        {query.page > 1 && (
          <a
            href={mySalesUrl(query)}
            className='inline-flex min-h-11 items-center rounded-lg border border-gray-200 px-3 text-sm text-gray-700'
          >
            처음으로
          </a>
        )}
        {query.page > 1 && (
          <a
            href={mySalesUrl(query, query.page - 1)}
            className='inline-flex min-h-11 items-center rounded-lg border border-gray-200 px-3 text-sm text-gray-700'
          >
            이전 페이지
          </a>
        )}
        {query.page < pages && (
          <a
            href={mySalesUrl(query, query.page + 1)}
            className='ml-auto inline-flex min-h-11 items-center rounded-lg bg-primary-200 px-3 text-sm font-medium text-white'
          >
            다음 페이지
          </a>
        )}
      </nav>
      <p className='text-xs leading-5 text-gray-500'>
        시각은 한국시간(KST)입니다. 입찰 횟수는 저장된 입찰 기록 수입니다. 경매
        종료는 판매·결제 완료를 뜻하지 않습니다. 최신 가격과 상태는 새로고침해서
        확인하세요.
      </p>
    </section>
  );
}
