import { beforeEach, describe, it, expect, vi } from 'vitest';
const { auth, get, post } = vi.hoisted(() => ({
  auth: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
}));
vi.mock('@/actions/auth', () => ({ auth }));
vi.mock('@/actions/instance', () => ({ instance: { get, post } }));
import { getSellerDemoAvailability, prepareSellerDemo } from './seller-demo';
const id = '10000000-0000-4000-8000-000000000001',
  root = '/auction-service/api/v1/auctions/seller-demo';
describe('private seller demo action boundary', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    auth.mockResolvedValue({ user: { accessToken: 'fixture-only' } });
    get.mockResolvedValue({ available: true });
    post.mockResolvedValue({ auctionUuid: id, status: 'created' });
  });
  it('requires a session before reading availability or preparing', async () => {
    auth.mockResolvedValue(null);
    expect(await getSellerDemoAvailability()).toMatchObject({
      ok: false,
      error: { code: 'AUTH_REQUIRED' },
    });
    expect(await prepareSellerDemo()).toMatchObject({
      ok: false,
      error: { code: 'AUTH_REQUIRED' },
    });
    expect(get).not.toHaveBeenCalled();
    expect(post).not.toHaveBeenCalled();
  });
  it('returns only availability and distinguishes false from failed reads', async () => {
    get.mockResolvedValueOnce({ available: true, credentials: 'private' });
    expect(await getSellerDemoAvailability()).toEqual({
      ok: true,
      available: true,
    });
    get.mockResolvedValueOnce({ available: false });
    expect(await getSellerDemoAvailability()).toEqual({
      ok: true,
      available: false,
    });
    get.mockResolvedValueOnce({ available: 'false' });
    expect(await getSellerDemoAvailability()).toMatchObject({
      ok: false,
      error: { code: 'REQUEST_FAILED' },
    });
    expect(get).toHaveBeenCalledWith(root, { cache: 'no-store' });
  });
  it.each(['created', 'reused'] as const)(
    'prepares %s with no client identity and projects only a validated UUID',
    async (status) => {
      post.mockResolvedValue({ auctionUuid: id, status, password: 'private' });
      expect(await prepareSellerDemo()).toEqual({
        ok: true,
        auctionUuid: id,
        status,
      });
      expect(post).toHaveBeenCalledWith(
        root,
        {},
        { cache: 'no-store', timeout: 15000 },
      );
      expect(post).toHaveBeenCalledTimes(1);
    },
  );
  it.each([
    { auctionUuid: 'https://evil.test', status: 'created' },
    { auctionUuid: '../other', status: 'reused' },
    { auctionUuid: id, status: 'updated' },
    null,
  ])('refuses malformed success %#', async (response) => {
    post.mockResolvedValue(response);
    expect(await prepareSellerDemo()).toMatchObject({
      ok: false,
      error: { code: 'REQUEST_FAILED' },
    });
    expect(post).toHaveBeenCalledTimes(1);
  });
  it.each([
    ['HTTP_ERROR_401', 'AUTH_REQUIRED'],
    ['HTTP_ERROR_403', 'UNAVAILABLE'],
    ['SELLER_DEMO_COOLDOWN', 'COOLDOWN'],
    ['HTTP_ERROR_429', 'COOLDOWN'],
    ['TIMEOUT_ERROR', 'REQUEST_FAILED'],
  ] as const)(
    'sanitizes %s without an automatic write retry',
    async (code, expected) => {
      post.mockRejectedValue({
        code,
        message: 'private upstream detail',
        password: 'private',
      });
      const result = await prepareSellerDemo();
      expect(result).toMatchObject({ ok: false, error: { code: expected } });
      expect(JSON.stringify(result)).not.toContain('private');
      expect(post).toHaveBeenCalledTimes(1);
    },
  );
});
