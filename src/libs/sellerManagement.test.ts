import { describe, it, expect } from 'vitest';
import {
  fromKstHourInput,
  toKstHourInput,
  parseSellerAuction,
  parseSellerUpdateInput,
  parseSellerCancellation,
} from './sellerManagement';
const id = '10000000-0000-4000-8000-000000000001';
const snapshot = {
  title: '판매자 경매 테스트',
  description: '설명',
  minimumBid: '1000',
  startAt: '2098-01-01T00:00:00.000Z',
  endAt: '2098-01-02T00:00:00.000Z',
  status: 'visible',
};
describe('seller management projection and form values', () => {
  it('converts KST whole hours independently of the machine timezone and rejects malformed dates', () => {
    expect(toKstHourInput('2098-01-01T18:00:00.000Z')).toBe('2098-01-02T03:00');
    expect(fromKstHourInput('2098-01-02T03:00')).toBe(
      '2098-01-01T18:00:00.000Z',
    );
    for (const value of [
      '2098-02-30T03:00',
      '2098-01-02T03:30',
      '2098-01-02',
      'garbage',
    ])
      expect(fromKstHourInput(value)).toBeNull();
  });
  it('whitelists nested history and preserves existing exact large money for read-only display', () => {
    const row = {
      auctionUuid: id,
      ...snapshot,
      minimumBid: '9007199254740993',
      status: 'cancelled',
      version: 2,
      editable: false,
      history: [
        {
          action: 'cancel',
          reasonCode: 'other',
          reasonDetail: '판매 불가',
          before: { ...snapshot, privateToken: 'secret' },
          after: { ...snapshot, status: 'cancelled' },
          createdAt: '2026-10-31T00:00:00Z',
          privateToken: 'secret',
        },
      ],
      privateToken: 'secret',
    };
    const result = parseSellerAuction(row, id);
    expect(result?.minimumBid).toBe('9007199254740993');
    expect(JSON.stringify(result)).not.toContain('secret');
    expect(result?.history[0].reasonDetail).toBe('판매 불가');
    expect(parseSellerAuction({ ...row, editable: true }, id)).toBeNull();
    expect(
      parseSellerAuction(
        { ...row, auctionUuid: '20000000-0000-4000-8000-000000000002' },
        id,
      ),
    ).toBeNull();
  });
  it('validates input price bounds, future-schedule shape, and predefined reason normalization', () => {
    const input = { version: 2, ...snapshot };
    delete (input as { status?: string }).status;
    expect(parseSellerUpdateInput(input)).toMatchObject({
      minimumBid: '1000',
      version: 2,
    });
    expect(
      parseSellerUpdateInput({ ...input, minimumBid: '9007199254740992' }),
    ).toBeNull();
    expect(
      parseSellerUpdateInput({ ...input, minimumBid: '2147483648' }),
    ).toBeNull();
    expect(
      parseSellerUpdateInput({ ...input, minimumBid: '2147483647' }),
    ).toMatchObject({ minimumBid: '2147483647' });
    expect(parseSellerUpdateInput({ ...input, status: 'visible' })).toBeNull();
    expect(
      parseSellerCancellation({ version: 2, reasonCode: 'listing_error' }),
    ).toEqual({ version: 2, reasonCode: 'listing_error' });
    expect(
      parseSellerCancellation({
        version: 2,
        reasonCode: 'listing_error',
        reasonDetail: 'custom',
      }),
    ).toBeNull();
  });
});
