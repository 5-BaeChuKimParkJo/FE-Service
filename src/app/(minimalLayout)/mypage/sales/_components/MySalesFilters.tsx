import { mySalesStatuses, mySalesUrl } from '@/libs/mySales';
import type { MySalesQuery } from '@/types/auction/my-sales';

export function MySalesFilters({ query }: { query: MySalesQuery }) {
  const input =
    'min-h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700';
  return (
    <form
      key={mySalesUrl(query, query.page)}
      action='/mypage/sales'
      method='get'
      aria-label='내 경매 검색 조건'
      className='space-y-3 rounded-xl border border-gray-200 bg-white p-4'
    >
      <div>
        <label
          htmlFor='sales-query'
          className='mb-2 block text-xs font-medium text-gray-600'
        >
          경매 제목 검색
        </label>
        <input
          id='sales-query'
          name='q'
          type='search'
          maxLength={80}
          defaultValue={query.q}
          placeholder='내가 등록한 경매 검색'
          className={input}
        />
      </div>
      <div className='grid grid-cols-2 gap-3'>
        <div>
          <label
            htmlFor='sales-status'
            className='mb-2 block text-xs font-medium text-gray-600'
          >
            경매 상태
          </label>
          <select
            id='sales-status'
            name='status'
            defaultValue={query.status}
            className={input}
          >
            <option value='all'>전체</option>
            {Object.entries(mySalesStatuses).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor='sales-sort'
            className='mb-2 block text-xs font-medium text-gray-600'
          >
            정렬
          </label>
          <select
            id='sales-sort'
            name='sort'
            defaultValue={query.sort}
            className={input}
          >
            <option value='recent'>최근 등록순</option>
            <option value='ending'>마감 빠른순</option>
            <option value='price'>가격 높은순</option>
          </select>
        </div>
      </div>
      <button
        type='submit'
        className='inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary-200 px-4 text-sm font-medium text-white'
      >
        조회
      </button>
    </form>
  );
}
