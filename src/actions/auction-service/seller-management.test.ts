import { beforeEach, describe, expect, it, vi } from 'vitest';
const { auth, get, patch, post } = vi.hoisted(() => ({
  auth: vi.fn(),
  get: vi.fn(),
  patch: vi.fn(),
  post: vi.fn(),
}));
vi.mock('@/actions/auth', () => ({ auth }));
vi.mock('@/actions/instance', () => ({ instance: { get, patch, post } }));
import {
  getSellerAuction,
  updateSellerAuction,
  cancelSellerAuction,
} from './seller-management';
const id = '10000000-0000-4000-8000-000000000001';
const input = {
  version: 2,
  title: '수정할 경매 제목',
  description: '설명',
  minimumBid: '1000',
  startAt: '2098-01-01T00:00:00Z',
  endAt: '2098-01-02T00:00:00Z',
};
const data = () => ({
  auctionUuid: id,
  ...input,
  status: 'waiting',
  editable: true,
  history: [],
});
describe('seller management action boundaries', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    auth.mockResolvedValue({ user: { accessToken: 'server-fixture-token' } });
    get.mockResolvedValue(data());
    patch.mockResolvedValue({ ok: true });
    post.mockResolvedValue({ ok: true });
  });
  it('requires session and valid identity before any upstream call', async () => {
    auth.mockResolvedValue(null);
    expect(await getSellerAuction(id)).toMatchObject({
      ok: false,
      error: { code: 'AUTH_REQUIRED' },
    });
    expect(await updateSellerAuction(id, input)).toMatchObject({
      ok: false,
      error: { code: 'AUTH_REQUIRED' },
    });
    expect(
      await cancelSellerAuction(id, {
        version: 2,
        reasonCode: 'listing_error',
      }),
    ).toMatchObject({ ok: false, error: { code: 'AUTH_REQUIRED' } });
    auth.mockResolvedValue({ user: { accessToken: 'fixture' } });
    expect(await getSellerAuction('../mine')).toMatchObject({
      ok: false,
      error: { code: 'INVALID_REQUEST' },
    });
    expect(get).not.toHaveBeenCalled();
    expect(patch).not.toHaveBeenCalled();
    expect(post).not.toHaveBeenCalled();
  });
  it('projects owner data with no-store and omits unexpected private upstream fields', async () => {
    get.mockResolvedValue({
      ...data(),
      sellerUuid: 'private',
      token: 'private',
    });
    expect(await getSellerAuction(id)).toEqual({ ok: true, data: data() });
    expect(get).toHaveBeenCalledWith(
      '/auction-service/api/v1/auctions/' + id + '/seller',
      { cache: 'no-store' },
    );
  });
  it('rejects malformed data and injected mutation keys without writes', async () => {
    get.mockResolvedValue({ ...data(), version: '2' });
    expect(await getSellerAuction(id)).toMatchObject({
      ok: false,
      error: { code: 'REQUEST_FAILED' },
    });
    for (const value of [
      { ...input, sellerUuid: id },
      { ...input, minimumBid: 1000 },
      { ...input, version: -1 },
      { ...input, startAt: '2098-01-01T00:30:00Z' },
    ])
      expect(await updateSellerAuction(id, value)).toMatchObject({
        ok: false,
        error: { code: 'INVALID_REQUEST' },
      });
    expect(
      await cancelSellerAuction(id, {
        version: 2,
        reasonCode: 'other',
        reasonDetail: '  ',
      }),
    ).toMatchObject({ ok: false, error: { code: 'INVALID_REQUEST' } });
    expect(patch).not.toHaveBeenCalled();
    expect(post).not.toHaveBeenCalled();
  });
  it('sends the original version, exact fields and structured reason on distinct endpoints', async () => {
    expect(await updateSellerAuction(id, input)).toEqual({ ok: true });
    expect(patch).toHaveBeenCalledWith(
      '/auction-service/api/v1/auctions/' + id + '/seller',
      input,
      { cache: 'no-store' },
    );
    expect(
      await cancelSellerAuction(id, {
        version: 2,
        reasonCode: 'other',
        reasonDetail: '  판매 불가  ',
      }),
    ).toEqual({ ok: true });
    expect(post).toHaveBeenCalledWith(
      '/auction-service/api/v1/auctions/' + id + '/seller/cancel',
      { version: 2, reasonCode: 'other', reasonDetail: '판매 불가' },
      { cache: 'no-store' },
    );
  });
  it.each([
    ['HTTP_ERROR_401', 'AUTH_REQUIRED'],
    ['UNAUTHORIZED', 'AUTH_REQUIRED'],
    ['HTTP_ERROR_404', 'UNAVAILABLE'],
    ['HTTP_ERROR_409', 'CONFLICT'],
    ['TIMEOUT_ERROR', 'REQUEST_FAILED'],
  ] as const)(
    'sanitizes %s without retrying or exposing server text',
    async (code, expected) => {
      patch.mockRejectedValue({
        code,
        message: 'private database detail',
        token: 'private-token',
      });
      const result = await updateSellerAuction(id, input);
      expect(result).toMatchObject({ ok: false, error: { code: expected } });
      expect(JSON.stringify(result)).not.toContain('private');
      expect(patch).toHaveBeenCalledTimes(1);
    },
  );
  it('rejects an invalid success response rather than claiming the mutation succeeded', async () => {
    post.mockResolvedValue({ ok: false });
    expect(
      await cancelSellerAuction(id, {
        version: 2,
        reasonCode: 'listing_error',
      }),
    ).toMatchObject({ ok: false, error: { code: 'REQUEST_FAILED' } });
  });
});
