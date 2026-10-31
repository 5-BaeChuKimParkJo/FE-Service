import { getSellerAuction } from '@/actions/auction-service/seller-management';
import Link from 'next/link';
import { SessionSignInButton } from '@/components/auth/SessionSignInButton';
import { sellerCancellationReasons } from '@/libs/sellerManagement';
import { formatBidHistoryTime } from '@/libs/bidHistory';
import { mySalesStatuses, formatMySalesAmount } from '@/libs/mySales';
import type { MySaleStatus } from '@/types/auction/my-sales';
import type { SellerAuctionSnapshot } from '@/types/auction/seller-management';
import { SellerAuctionForm } from './_components/SellerAuctionForm';

export const dynamic = 'force-dynamic';
const fields = {
  title: '제목',
  description: '설명',
  minimumBid: '시작가',
  startAt: '시작 시각 (KST)',
  endAt: '종료 시각 (KST)',
} as const;
function display(key: keyof typeof fields, value: string) {
  return key === 'minimumBid'
    ? formatMySalesAmount(value) + '원'
    : key === 'startAt' || key === 'endAt'
      ? formatBidHistoryTime(value)
      : value || '비어 있음';
}
export default async function SellerManagementPage({
  params,
}: {
  params: Promise<{ auctionUuid: string }>;
}) {
  const { auctionUuid } = await params;
  const result = await getSellerAuction(auctionUuid);
  return (
    <div className='min-w-0 space-y-5 p-4'>
      <Link
        href='/mypage/sales'
        prefetch={false}
        className='inline-flex min-h-11 items-center text-sm font-medium text-gray-600'
      >
        ← 내 경매로
      </Link>
      <header>
        <h1 className='text-2xl font-bold text-gray-900'>경매 관리</h1>
        <p className='mt-2 text-sm leading-6 text-gray-500'>
          입찰이 시작되기 전의 공개 경매만 수정·취소할 수 있습니다.
        </p>
      </header>
      {!result.ok ? (
        <section
          role='alert'
          className='rounded-xl border border-red-100 bg-red-50 p-5'
        >
          <h2 className='font-semibold'>경매를 불러오지 못했습니다</h2>
          <p className='mt-3 text-sm leading-6'>{result.error.message}</p>
          {result.error.code === 'AUTH_REQUIRED' && (
            <div className='mt-4'>
              <SessionSignInButton returnTo={'/mypage/sales/' + auctionUuid}>
                로그인하기
              </SessionSignInButton>
            </div>
          )}
        </section>
      ) : (
        <>
          <section
            aria-label='현재 경매'
            className='rounded-xl border border-gray-200 bg-white p-4'
          >
            <span className='inline-flex rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700'>
              {mySalesStatuses[result.data.status as MySaleStatus]}
            </span>
            <h2 className='mt-3 break-words font-semibold leading-6'>
              {result.data.title}
            </h2>
            <p className='mt-2 text-sm text-gray-500'>
              시작가 {formatMySalesAmount(result.data.minimumBid)}원 · 마감{' '}
              {formatBidHistoryTime(result.data.endAt)}
            </p>
          </section>
          {result.data.editable ? (
            <SellerAuctionForm data={result.data} />
          ) : (
            <section className='rounded-xl border border-gray-200 bg-gray-50 p-5'>
              <h2 className='font-semibold'>수정·취소할 수 없는 경매입니다</h2>
              <p className='mt-2 text-sm leading-6 text-gray-600'>
                이미 시작됐거나 입찰·거래가 있는 경매, 숨김·취소된 경매는 변경할
                수 없습니다. 아래에서 이전 변경 이력을 확인할 수 있습니다.
              </p>
            </section>
          )}
          <section
            aria-label='판매자 변경 이력'
            className='rounded-xl border border-gray-200 bg-white p-4 sm:p-6'
          >
            <h2 className='text-lg font-semibold'>판매자 변경 이력</h2>
            <p className='mt-2 text-xs text-gray-500'>
              최근 20건 · 한국시간(KST)
            </p>
            {result.data.history.length ? (
              <ol className='mt-4 divide-y divide-gray-100'>
                {result.data.history.map((item, index) => (
                  <li
                    key={item.createdAt + '-' + index}
                    className='py-4 first:pt-0'
                  >
                    <div className='flex flex-wrap justify-between gap-2 text-sm'>
                      <h3 className='font-semibold'>
                        {item.action === 'cancel'
                          ? '출품 취소'
                          : '경매 정보 수정'}
                      </h3>
                      <time dateTime={item.createdAt} className='text-gray-500'>
                        {formatBidHistoryTime(item.createdAt)}
                      </time>
                    </div>
                    {item.action === 'cancel' ? (
                      <p className='mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-gray-600'>
                        {
                          sellerCancellationReasons[
                            item.reasonCode as keyof typeof sellerCancellationReasons
                          ]
                        }
                        {item.reasonDetail ? ' · ' + item.reasonDetail : ''}
                      </p>
                    ) : (
                      <details className='mt-3 text-sm'>
                        <summary className='min-h-8 cursor-pointer text-gray-600'>
                          수정 내용 보기
                        </summary>
                        <dl className='mt-2 space-y-3'>
                          {(Object.keys(fields) as Array<keyof typeof fields>)
                            .filter(
                              (key) =>
                                item.before[
                                  key as keyof SellerAuctionSnapshot
                                ] !==
                                item.after[key as keyof SellerAuctionSnapshot],
                            )
                            .map((key) => (
                              <div
                                key={key}
                                className='rounded-lg bg-gray-50 p-3'
                              >
                                <dt className='font-medium'>{fields[key]}</dt>
                                <dd className='mt-1 whitespace-pre-wrap break-words leading-6 text-gray-500'>
                                  이전: {display(key, item.before[key])}
                                </dd>
                                <dd className='mt-1 whitespace-pre-wrap break-words leading-6 text-gray-800'>
                                  변경: {display(key, item.after[key])}
                                </dd>
                              </div>
                            ))}
                        </dl>
                      </details>
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <p className='mt-4 text-sm text-gray-500'>
                아직 변경 이력이 없습니다.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
