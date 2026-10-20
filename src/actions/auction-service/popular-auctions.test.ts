import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { cookieValues, setCookie } = vi.hoisted(() => ({
  cookieValues: new Map<string, string>(),
  setCookie: vi.fn(),
}));
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => {
      const value = cookieValues.get(name);
      return value === undefined ? undefined : { value };
    },
    set: setCookie,
  }),
}));

import { getPopularAuctions } from './get-popular-auctions';
import { trackAuctionView } from './track-auction-view';

const fetchMock = vi.fn<typeof fetch>();
const visitorUuid = '123e4567-e89b-42d3-a456-426614174000';
const auctionUuid = '123e4567-e89b-42d3-a456-426614174001';
const apiUrl = 'http://127.0.0.1:34421';

describe('popular auction HTTP contract', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    cookieValues.clear();
    vi.stubEnv('API_URL', apiUrl);
    vi.stubEnv('COOKIE_SECURE', 'false');
    vi.stubGlobal('fetch', fetchMock);
    setCookie.mockImplementation((name: string, value: string) => {
      cookieValues.set(name, value);
    });
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('fetches public ranking without rounding money or activity counts', async () => {
    fetchMock.mockResolvedValue(
      Response.json({
        items: [
          {
            rank: 1,
            auctionUuid,
            title: 'Precision fixture',
            thumbnailUrl: '/fixture.png',
            minimumBid: '9007199254740993',
            currentBid: '9007199254740995',
            startAt: '2026-10-01T00:00:00Z',
            endAt: '2099-01-01T00:00:00Z',
            uniqueViewers: '9007199254740997',
            uniqueBidders: '2',
            score: '9007199254741007',
          },
        ],
        generatedAt: '2026-10-20T00:00:00Z',
        windowHours: 24,
      }),
    );
    const result = await getPopularAuctions();
    expect(result.items[0]).toMatchObject({
      minimumBid: '9007199254740993',
      currentBid: '9007199254740995',
      uniqueViewers: '9007199254740997',
      score: '9007199254741007',
    });
    expect(fetchMock).toHaveBeenCalledWith(
      `${apiUrl}/auction-service/api/v1/auctions/popular`,
      expect.objectContaining({ method: 'GET', cache: 'no-store' }),
    );
    expect(fetchMock.mock.calls[0][1]?.headers).not.toHaveProperty(
      'Authorization',
    );
  });

  it('preserves an empty ranking instead of manufacturing popular items', async () => {
    fetchMock.mockResolvedValue(
      Response.json({ items: [], generatedAt: null, windowHours: 24 }),
    );
    expect(await getPopularAuctions()).toEqual({
      items: [],
      generatedAt: null,
      windowHours: 24,
    });
  });

  it('keeps ranking failures observable for the UI retry state', async () => {
    fetchMock.mockResolvedValue(
      Response.json(
        { code: 'UNAVAILABLE', message: 'Unavailable' },
        { status: 503 },
      ),
    );
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await expect(getPopularAuctions()).rejects.toMatchObject({
      code: 'UNAVAILABLE',
    });
    vi.restoreAllMocks();
  });

  it('creates and reuses a server-held anonymous UUID for 30 days', async () => {
    await trackAuctionView(auctionUuid);
    await trackAuctionView(auctionUuid);
    expect(setCookie).toHaveBeenCalledTimes(1);
    expect(setCookie).toHaveBeenCalledWith(
      'auctionVisitorUuid',
      expect.stringMatching(/^[0-9a-f-]{36}$/i),
      {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 2592000,
        path: '/',
      },
    );
    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body).toEqual({
      visitorUuid: cookieValues.get('auctionVisitorUuid'),
    });
    expect(JSON.parse(fetchMock.mock.calls[1][1]?.body as string)).toEqual(
      body,
    );
    expect(fetchMock.mock.calls[0][0]).toBe(
      `${apiUrl}/auction-service/api/v1/auctions/${auctionUuid}/views`,
    );
    expect(fetchMock.mock.calls[0][1]?.method).toBe('POST');
  });

  it('reuses a valid visitor cookie without resetting its lifetime', async () => {
    cookieValues.set('auctionVisitorUuid', visitorUuid);
    await trackAuctionView(auctionUuid);
    expect(setCookie).not.toHaveBeenCalled();
    expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual({
      visitorUuid,
    });
  });

  it('replaces malformed visitor cookies and uses Secure when HTTPS cookies are configured', async () => {
    cookieValues.set('auctionVisitorUuid', 'forged-invalid-id');
    vi.stubEnv('COOKIE_SECURE', 'true');
    await trackAuctionView(auctionUuid);
    expect(setCookie).toHaveBeenCalledWith(
      'auctionVisitorUuid',
      expect.not.stringContaining('forged'),
      expect.objectContaining({ secure: true }),
    );
  });

  it('forwards the access token while sending no browser-supplied member identity in the view body', async () => {
    cookieValues.set('accessToken', 'verified-by-backend');
    cookieValues.set('memberUuid', 'untrusted-browser-member');
    await trackAuctionView(auctionUuid);
    expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual({});
    expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({
      Authorization: 'Bearer verified-by-backend',
    });
    expect(setCookie).not.toHaveBeenCalled();
  });

  it('absorbs tracking failures so the rendered detail remains usable', async () => {
    fetchMock.mockRejectedValue(new TypeError('offline'));
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await expect(trackAuctionView(auctionUuid)).resolves.toBeUndefined();
    vi.restoreAllMocks();
  });

  it('does not retry an invalid JWT as an anonymous visitor', async () => {
    cookieValues.set('accessToken', 'invalid-jwt');
    fetchMock.mockResolvedValue(
      Response.json(
        { code: 'UNAUTHORIZED', message: 'Invalid JWT' },
        { status: 401 },
      ),
    );
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await expect(trackAuctionView(auctionUuid)).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({
      Authorization: 'Bearer invalid-jwt',
    });
    expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual({});
    expect(setCookie).not.toHaveBeenCalled();
  });
});
