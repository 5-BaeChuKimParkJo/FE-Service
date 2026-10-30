import Link from 'next/link';
import { Heart } from 'lucide-react';
import { getSavedAuctions } from '@/actions/auction-service/saved-auctions';
import { SavedAuctionCard } from '@/components/mypage/SavedAuctionCard';
import { SavedAuctionsRefresh } from '@/components/mypage/SavedAuctionsRefresh';
import { EmptyState } from '@/components/common/EmptyState';
import { SessionSignInButton } from '@/components/auth/SessionSignInButton';

export default async function SavedAuctionsPage({
  searchParams,
}: {
  searchParams: Promise<{ cursor?: string | string[] }>;
}) {
  const { cursor } = await searchParams;
  const result = await getSavedAuctions(cursor);
  return (
    <div className='space-y-5 p-4'>
      <header>
        <h1 className='text-2xl font-bold text-gray-900'>관심 경매</h1>
        <p className='mt-2 text-sm leading-6 text-gray-500'>
          마음에 든 경매를 저장하고 다른 기기에서도 이어서 확인하세요.
        </p>
      </header>
      <div className='flex items-center justify-between gap-2'>
        <p className='text-xs text-gray-500'>최근 등록순 · 20개씩 보기</p>
        <SavedAuctionsRefresh />
      </div>
      {!result.ok ? (
        <section
          role='alert'
          className='rounded-xl border border-gray-200 bg-white px-4 py-8 text-center'
        >
          <h2 className='font-semibold text-gray-900'>
            관심 경매를 불러오지 못했습니다
          </h2>
          <p className='mt-3 text-sm text-gray-600'>{result.error.message}</p>
          {result.error.code === 'AUTH_REQUIRED' && (
            <div className='mt-4'>
              <SessionSignInButton returnTo='/mypage/saved-auctions'>
                로그인하기
              </SessionSignInButton>
            </div>
          )}
          {cursor !== undefined && (
            <Link
              href='/mypage/saved-auctions'
              className='mt-4 inline-flex min-h-11 items-center px-3 text-sm text-primary-200'
            >
              처음으로
            </Link>
          )}
        </section>
      ) : (
        <>
          {result.page.items.length ? (
            <ul aria-label='관심 경매 목록' className='space-y-4'>
              {result.page.items.map((item) => (
                <li key={item.auctionUuid}>
                  <SavedAuctionCard item={item} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              className='[&_a]:bg-primary-200 [&_a]:hover:bg-primary-300'
              icon={Heart}
              title={
                cursor
                  ? '이 페이지에 표시할 경매가 없습니다'
                  : '저장한 관심 경매가 없습니다'
              }
              description='경매 상세에서 관심 등록을 눌러보세요.'
              actionHref='/auctions'
              actionText='경매 둘러보기'
            />
          )}
          <nav
            aria-label='관심 경매 페이지'
            className='flex items-center justify-between gap-3'
          >
            {cursor !== undefined ? (
              <Link
                href='/mypage/saved-auctions'
                prefetch={false}
                className='inline-flex min-h-11 items-center rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700'
              >
                처음으로
              </Link>
            ) : (
              <span />
            )}
            {result.page.nextCursor && (
              <Link
                href={
                  '/mypage/saved-auctions?cursor=' +
                  encodeURIComponent(result.page.nextCursor)
                }
                prefetch={false}
                className='inline-flex min-h-11 items-center rounded-lg bg-primary-200 px-4 text-sm font-medium text-white'
              >
                다음 페이지
              </Link>
            )}
          </nav>
        </>
      )}
      <p className='text-xs leading-5 text-gray-500'>
        등록 시각은 한국시간(KST)입니다. 숨김·취소·삭제된 경매는 목록에서
        제외됩니다. 최신 가격과 상태는 새로고침해서 확인하세요.
      </p>
    </div>
  );
}
