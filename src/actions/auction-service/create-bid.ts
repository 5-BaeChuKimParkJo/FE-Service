'use server';

import { ErrorResponse } from '@/types/api';
import { instance } from '@/actions/instance';
import { auth } from '@/actions/auth';
import { AuctionBiddersResponse } from '@/types/auction';
import { isErrorResponse } from '@/utils/type-guards';

type BidResult = { ok: true } | { ok: false; error: ErrorResponse };
type AuctionState = {
  status: string;
  minimumBid: number;
  sellerUuid: string;
};

const readOptions = { cache: 'no-store' as const, timeout: 2000 };
const failed = (code: string, message: string): BidResult => ({
  ok: false,
  error: { code, message },
});

export async function createBid(
  auctionUuid: string,
  bidAmount: number,
): Promise<BidResult> {
  const user = (await auth())?.user;
  if (!user?.accessToken || !user.memberUuid) {
    return failed('AUTH_REQUIRED', '로그인 후 입찰해 주세요.');
  }
  if (!Number.isSafeInteger(bidAmount) || bidAmount < 1000) {
    return failed(
      'INVALID_BID_AMOUNT',
      '입찰 금액은 1,000원 이상의 정수여야 합니다.',
    );
  }
  const path = `/auction-service/api/v1/auctions/${encodeURIComponent(auctionUuid)}`;
  let auction: AuctionState;
  let bidders: AuctionBiddersResponse;
  try {
    [auction, bidders] = await Promise.all([
      instance.get<AuctionState>(path, readOptions),
      instance.get<AuctionBiddersResponse>(`${path}/bidders`, readOptions),
    ]);
  } catch {
    return failed(
      'BID_STATE_UNAVAILABLE',
      '현재 입찰 정보를 확인하지 못했습니다. 잠시 후 다시 확인해 주세요.',
    );
  }
  if (auction.status !== 'active') {
    return failed('AUCTION_NOT_ACTIVE', '현재 입찰 가능한 경매가 아닙니다.');
  }
  if (auction.sellerUuid === user.memberUuid) {
    return failed('SELLER_BID', '자신의 상품에는 입찰할 수 없습니다.');
  }
  if (bidders.items[0]?.bidderUuid === user.memberUuid) {
    return failed(
      'ALREADY_HIGHEST_BIDDER',
      '이미 최고 입찰자입니다. 다른 입찰자가 입찰한 후 다시 참여할 수 있습니다.',
    );
  }
  const currentBid = Math.max(
    auction.minimumBid,
    bidders.items[0]?.bidAmount ?? 0,
  );
  if (bidAmount <= currentBid || bidAmount > Math.floor(currentBid * 1.3)) {
    return failed(
      'INVALID_BID_AMOUNT',
      '현재 입찰가보다 높고 30% 이내인 금액을 입력해 주세요.',
    );
  }

  const deadline = Date.now() + 15000;
  try {
    await instance.post(
      `/auction-service/api/v2/auctions/${encodeURIComponent(auctionUuid)}/bidders`,
      { bidAmount, requestId: crypto.randomUUID() },
      { timeout: 5000 },
    );
  } catch (error) {
    if (isErrorResponse(error) && /^HTTP_ERROR_4\d\d$/.test(error.code)) {
      return { ok: false, error };
    }
    // A lost response can follow a successful enqueue. Confirm without resubmitting.
  }
  while (Date.now() < deadline) {
    try {
      const result = await instance.get<AuctionBiddersResponse>(
        `${path}/bidders`,
        readOptions,
      );
      if (
        result.items.some(
          (bid) =>
            bid.auctionUuid === auctionUuid &&
            bid.bidderUuid === user.memberUuid &&
            bid.bidAmount === bidAmount,
        )
      ) {
        return { ok: true };
      }
      if (result.items[0]?.bidAmount >= bidAmount) {
        return failed(
          'BID_PRICE_CHANGED',
          '현재 입찰가가 변경되었습니다. 입찰 내역을 확인하고 새로고침해 주세요.',
        );
      }
      if (result.items[0]?.bidderUuid === user.memberUuid) {
        return failed('ALREADY_HIGHEST_BIDDER', '이미 최고 입찰자입니다.');
      }
    } catch {
      // A temporary read failure does not establish that the bid failed.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return failed(
    'BID_PENDING',
    '입찰 결과를 아직 확인하지 못했습니다. 입찰 내역을 먼저 확인해 주세요.',
  );
}
