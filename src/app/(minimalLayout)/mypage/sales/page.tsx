import { getMyAuctions } from '@/actions/auction-service';
import {
  defaultMySalesQuery,
  mySalesUrl,
  parseMySalesQuery,
} from '@/libs/mySales';
import { SessionSignInButton } from '@/components/auth/SessionSignInButton';
import { MySalesContent } from './_components/MySalesContent';
import { MySalesFilters } from './_components/MySalesFilters';
import { MySalesRefresh } from './_components/MySalesRefresh';

export default async function MySalesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = parseMySalesQuery(params) ?? defaultMySalesQuery;
  const result = await getMyAuctions(params);
  return (
    <div className='space-y-5 p-4'>
      <header>
        <h1 className='text-2xl font-bold text-gray-900'>내 경매</h1>
        <p className='mt-2 text-sm leading-6 text-gray-500'>
          내가 등록한 경매의 진행 상황을 한곳에서 확인하세요.
        </p>
      </header>
      <MySalesFilters query={query} />
      <div className='flex justify-end'>
        <MySalesRefresh query={query} />
      </div>
      {result.ok ? (
        <MySalesContent data={result.data} query={query} />
      ) : (
        <section
          role='alert'
          className='rounded-xl border border-red-100 bg-red-50 p-5'
        >
          <h2 className='font-semibold text-gray-900'>
            내 경매를 불러오지 못했습니다
          </h2>
          <p className='mt-3 text-sm text-gray-600'>{result.error.message}</p>
          <div className='mt-4'>
            {result.error.code === 'AUTH_REQUIRED' ? (
              <SessionSignInButton returnTo={mySalesUrl(query, query.page)}>
                로그인하기
              </SessionSignInButton>
            ) : (
              <a
                href='/mypage/sales'
                className='inline-flex min-h-11 items-center rounded-lg border border-gray-200 px-3 text-sm text-gray-700'
              >
                조건 초기화
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
