'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  updateSellerAuction,
  cancelSellerAuction,
} from '@/actions/auction-service/seller-management';
import {
  fromKstHourInput,
  toKstHourInput,
  sellerCancellationReasons,
} from '@/libs/sellerManagement';
import type {
  SellerAuctionData,
  SellerManagementFailure,
} from '@/types/auction/seller-management';
import { SessionSignInButton } from '@/components/auth/SessionSignInButton';

const field =
  'mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 disabled:bg-gray-50';
const button =
  'inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50';
export function SellerAuctionForm({ data }: { data: SellerAuctionData }) {
  const [title, setTitle] = useState(data.title),
    [description, setDescription] = useState(data.description),
    [price, setPrice] = useState(data.minimumBid);
  const [start, setStart] = useState(toKstHourInput(data.startAt)),
    [end, setEnd] = useState(toKstHourInput(data.endAt));
  const [reason, setReason] = useState(''),
    [detail, setDetail] = useState(''),
    [confirmed, setConfirmed] = useState(false);
  const [ready, setReady] = useState(false),
    [pending, setPending] = useState(false),
    [error, setError] = useState<SellerManagementFailure['error'] | null>(null);
  const busy = useRef(false);
  useEffect(() => setReady(true), []);
  const url = '/mypage/sales/' + data.auctionUuid;
  async function submit(event: FormEvent, action: 'update' | 'cancel') {
    event.preventDefault();
    if (!ready || busy.current || (action === 'cancel' && !confirmed)) return;
    busy.current = true;
    setPending(true);
    setError(null);
    let navigating = false;
    try {
      const result =
        action === 'update'
          ? await updateSellerAuction(data.auctionUuid, {
              version: data.version,
              title,
              description,
              minimumBid: price,
              startAt: fromKstHourInput(start),
              endAt: fromKstHourInput(end),
            })
          : await cancelSellerAuction(data.auctionUuid, {
              version: data.version,
              reasonCode: reason,
              ...(reason === 'other' ? { reasonDetail: detail } : {}),
            });
      if (result.ok) {
        navigating = true;
        window.location.assign(url);
        return;
      }
      setError(result.error);
    } catch {
      navigating = false;
      setError({
        code: 'REQUEST_FAILED',
        message:
          '처리 결과를 확인하지 못했습니다. 다시 요청하기 전에 새로고침해 확인해 주세요.',
      });
    } finally {
      if (!navigating) {
        busy.current = false;
        setPending(false);
      }
    }
  }
  return (
    <div className='space-y-5'>
      {error && (
        <div
          role='alert'
          aria-label='경매 변경 결과'
          className='rounded-xl border border-red-200 bg-red-50 p-4 text-sm'
        >
          <p className='leading-6 text-red-800'>{error.message}</p>
          {error.code === 'AUTH_REQUIRED' ? (
            <div className='mt-3'>
              <SessionSignInButton returnTo={url}>
                로그인하기
              </SessionSignInButton>
            </div>
          ) : (
            <a
              href={url}
              className='mt-3 inline-flex min-h-11 items-center font-semibold underline'
            >
              최신 상태 확인
            </a>
          )}
        </div>
      )}
      <section
        aria-labelledby='seller-edit-heading'
        className='rounded-xl border border-gray-200 bg-white p-4 sm:p-6'
      >
        <h2 id='seller-edit-heading' className='text-lg font-semibold'>
          경매 정보 수정
        </h2>
        <p className='mt-2 text-sm leading-6 text-gray-500'>
          사진·카테고리는 유지됩니다. 시각은 한국시간(KST) 기준 정각으로, 종료는
          시작보다 1시간 이상 뒤로 선택해 주세요.
        </p>
        <form
          onSubmit={(event) => void submit(event, 'update')}
          className='mt-5'
        >
          <fieldset disabled={pending || !ready} className='space-y-4'>
            <div>
              <label htmlFor='seller-title' className='text-sm font-medium'>
                경매 제목
              </label>
              <input
                id='seller-title'
                className={field}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                minLength={5}
                maxLength={100}
                required
              />
            </div>
            <div>
              <label
                htmlFor='seller-description'
                className='text-sm font-medium'
              >
                상품 설명
              </label>
              <textarea
                id='seller-description'
                className={field + ' min-h-32 resize-y'}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={1000}
                rows={5}
              />
            </div>
            <div>
              <label htmlFor='seller-price' className='text-sm font-medium'>
                시작가 (원)
              </label>
              <input
                id='seller-price'
                className={field + ' tabular-nums'}
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                inputMode='numeric'
                pattern='[1-9][0-9]{3,15}'
                maxLength={16}
                required
              />
              <p className='mt-1 text-xs text-gray-500'>
                1,000원 이상, 숫자만 입력해 주세요.
              </p>
            </div>
            <div className='grid min-w-0 gap-4 sm:grid-cols-2'>
              <div className='min-w-0'>
                <label htmlFor='seller-start' className='text-sm font-medium'>
                  시작 시각 (KST)
                </label>
                <input
                  id='seller-start'
                  className={field + ' min-w-0 max-w-full'}
                  type='datetime-local'
                  step={3600}
                  value={start}
                  onChange={(event) => setStart(event.target.value)}
                  required
                />
              </div>
              <div className='min-w-0'>
                <label htmlFor='seller-end' className='text-sm font-medium'>
                  종료 시각 (KST)
                </label>
                <input
                  id='seller-end'
                  className={field + ' min-w-0 max-w-full'}
                  type='datetime-local'
                  step={3600}
                  value={end}
                  onChange={(event) => setEnd(event.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type='submit'
              className={button + ' w-full bg-primary-200 text-white sm:w-auto'}
            >
              수정 저장
            </button>
          </fieldset>
        </form>
      </section>
      <section
        aria-labelledby='seller-cancel-heading'
        className='rounded-xl border border-red-100 bg-white p-4 sm:p-6'
      >
        <h2 id='seller-cancel-heading' className='text-lg font-semibold'>
          출품 취소
        </h2>
        <p className='mt-2 text-sm leading-6 text-gray-500'>
          취소한 경매는 다시 진행할 수 없습니다. 경매 정보와 취소 사유는 내
          경매에 남습니다.
        </p>
        <form
          onSubmit={(event) => void submit(event, 'cancel')}
          className='mt-5'
        >
          <fieldset disabled={pending || !ready} className='space-y-4'>
            <div>
              <label htmlFor='seller-reason' className='text-sm font-medium'>
                취소 사유
              </label>
              <select
                id='seller-reason'
                className={field}
                value={reason}
                onChange={(event) => {
                  setReason(event.target.value);
                  setDetail('');
                }}
                required
              >
                <option value='' disabled>
                  사유를 선택해 주세요
                </option>
                {Object.entries(sellerCancellationReasons).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ),
                )}
              </select>
            </div>
            {reason === 'other' && (
              <div>
                <label
                  htmlFor='seller-reason-detail'
                  className='text-sm font-medium'
                >
                  기타 사유
                </label>
                <textarea
                  id='seller-reason-detail'
                  className={field}
                  value={detail}
                  onChange={(event) => setDetail(event.target.value)}
                  maxLength={200}
                  required
                  rows={3}
                />
              </div>
            )}
            <label className='flex min-h-11 cursor-pointer items-center gap-3 text-sm leading-6'>
              <input
                type='checkbox'
                className='h-4 w-4 shrink-0'
                checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)}
                required
              />
              <span>출품 취소 내용을 확인했습니다</span>
            </label>
            <button
              type='submit'
              disabled={
                !confirmed || !reason || (reason === 'other' && !detail.trim())
              }
              className={
                button + ' w-full border border-red-200 text-red-700 sm:w-auto'
              }
            >
              출품 취소
            </button>
          </fieldset>
        </form>
      </section>
      <p aria-live='polite' className='text-sm text-gray-500'>
        {pending ? '처리 중입니다. 잠시 기다려 주세요.' : ''}
      </p>
    </div>
  );
}
