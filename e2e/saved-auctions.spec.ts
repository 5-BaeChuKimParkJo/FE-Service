import { createServer, type Server } from 'node:http';
import { test, expect } from '@playwright/test';

// Start Next with API_URL=http://127.0.0.1:34424; fake session works only in this fixture API.
const port = Number(process.env.SAVED_AUCTIONS_MOCK_PORT ?? 34424);
const root = '/auction-service/api/v1/auctions';
const ids = Array.from(
  { length: 24 },
  (_, i) => '10000000-0000-4000-8000-' + String(i + 1).padStart(12, '0'),
);
const item = (id: string) => ({
  auctionUuid: id,
  title: id === ids[0] ? '관심 등록할 카메라' : '관심 경매 ' + id.slice(-2),
  thumbnailUrl: '/images/dummy/airpods.png',
  minimumBid: '9007199254740993',
  currentBid: '9007199254740995',
  startAt: '2020-01-01T00:00:00Z',
  endAt: '2099-01-01T00:00:00Z',
  savedAt: '2026-10-29T00:00:00Z',
  status: 'active',
});
let server: Server;
let saved: Map<string, string>;
let mode: 'normal' | 'state-error' | 'write-error' | 'list-error';
let calls: Array<{ method: string; path: string }>;
let nextId: bigint;

test.beforeAll(async () => {
  server = createServer(async (request, response) => {
    const url = new URL(request.url ?? '/', 'http://127.0.0.1');
    const path = url.pathname;
    const chunks: Buffer[] = [];
    for await (const chunk of request) chunks.push(Buffer.from(chunk));
    const rawBody = Buffer.concat(chunks).toString();
    calls.push({ method: request.method ?? 'GET', path: path + url.search });
    response.setHeader('Content-Type', 'application/json');
    const send = (body: unknown, status = 200) => {
      response.statusCode = status;
      response.end(JSON.stringify(body));
    };
    if (path === root + '/saved' || path.endsWith('/saved')) {
      if (request.method === 'DELETE' && rawBody.trim() !== '{}')
        return send(
          {
            code: 'INVALID_REQUEST',
            message: 'JSON deletion requires an empty object',
          },
          400,
        );
      if (request.headers.authorization !== 'Bearer fake-saved-token')
        return send(
          { code: 'HTTP_ERROR_401', message: 'Fixture unauthorized' },
          401,
        );
      if (path === root + '/saved') {
        if (mode === 'list-error')
          return send({ code: 'FAILED', message: 'Fixture outage' }, 503);
        const cursor = url.searchParams.get('cursor');
        const rows = Array.from(saved.entries())
          .filter(([, key]) => !cursor || BigInt(key) < BigInt(cursor))
          .sort((a, b) => (BigInt(a[1]) > BigInt(b[1]) ? -1 : 1));
        const page = rows.slice(0, 20);
        return send({
          items: page.map(([id]) => item(id)),
          nextCursor: rows.length > 20 ? page[19][1] : null,
        });
      }
      const id = path.split('/').at(-2)!;
      if (!ids.includes(id))
        return send({ code: 'NOT_FOUND', message: 'Unavailable' }, 404);
      if (request.method === 'GET')
        return mode === 'state-error'
          ? send({ code: 'FAILED', message: 'Fixture outage' }, 503)
          : send({ saved: saved.has(id) });
      if (mode === 'write-error')
        return send({ code: 'FAILED', message: 'Fixture lost response' }, 503);
      await new Promise((resolve) => setTimeout(resolve, 200));
      if (request.method === 'PUT') {
        if (!saved.has(id)) saved.set(id, String(nextId++));
        return send({ saved: true });
      }
      if (request.method === 'DELETE') {
        saved.delete(id);
        return send({ saved: false });
      }
    }
    if (path.endsWith('/categories')) return send([]);
    if (path.endsWith('/bidders')) return send({ items: [], nextCursor: null });
    if (path.startsWith(root + '/') && ids.includes(path.split('/').at(-1)!)) {
      const id = path.split('/').at(-1)!;
      return send({
        ...item(id),
        minimumBid: 1000,
        currentBid: 1000,
        description: 'Saved auction fixture',
        isDirectDeal: false,
        productCondition: 'used',
        viewCount: 0,
        createdAt: '2026-10-29T00:00:00Z',
        sellerUuid: 'seller-fixture',
        tagIds: [],
        tagNames: [],
        categoryName: '기타',
        images: [],
      });
    }
    if (path.startsWith('/member-service/api/v1/member'))
      return send({
        memberUuid: 'seller-fixture',
        nickname: '판매자',
        state: 'ACTIVE',
        profileImageUrl: null,
        point: 100,
      });
    if (path.endsWith('/views')) {
      response.statusCode = 204;
      return response.end();
    }
    return send({ code: 'NOT_FOUND', message: 'Unconfigured fixture' }, 404);
  });
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });
});
test.afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
});
test.beforeEach(async ({ context, baseURL }) => {
  mode = 'normal';
  calls = [];
  const base = BigInt('9007199254740993');
  saved = new Map(
    ids.slice(1, 23).map((id, i) => [id, String(base + BigInt(i))]),
  );
  nextId = base + BigInt(22);
  await context.addCookies([
    { name: 'accessToken', value: 'fake-saved-token', url: baseURL! },
    { name: 'memberUuid', value: 'member-fixture', url: baseURL! },
  ]);
});

for (const device of [
  { name: 'desktop', viewport: { width: 1440, height: 1000 }, mobile: false },
  { name: 'mobile', viewport: { width: 390, height: 844 }, mobile: true },
]) {
  test.describe(device.name, () => {
    test.use({
      viewport: device.viewport,
      isMobile: device.mobile,
      hasTouch: device.mobile,
    });
    test('persists a detail save across reload and removes it from the personal list', async ({
      page,
    }) => {
      await page.goto('/auctions/' + ids[0]);
      await page
        .getByRole('button', { name: '관심 등록', exact: true })
        .click();
      await expect(
        page.getByRole('button', { name: '관심 해제', exact: true }),
      ).toBeVisible();
      await page.reload();
      await expect(
        page.getByRole('button', { name: '관심 해제', exact: true }),
      ).toBeVisible();
      await page.goto('/mypage/saved-auctions');
      const card = page.getByRole('article', {
        name: '관심 등록할 카메라',
        exact: true,
      });
      await expect(card).toBeVisible();
      await card
        .getByRole('button', { name: '관심 해제', exact: true })
        .click();
      await expect(card).toHaveCount(0);
      expect(calls.filter((c) => c.method === 'PUT')).toHaveLength(1);
      expect(calls.filter((c) => c.method === 'DELETE')).toHaveLength(1);
      expect(
        calls.some(
          (c) => /\/(checkout|bidders)$/.test(c.path) && c.method !== 'GET',
        ),
      ).toBe(false);
    });

    test('keeps unknown and failed state recoverable without toggling or duplicate saves', async ({
      page,
    }) => {
      mode = 'state-error';
      await page.goto('/auctions/' + ids[0]);
      await expect(
        page.getByRole('button', { name: '관심 상태 다시 확인', exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: '관심 등록', exact: true }),
      ).toHaveCount(0);
      expect(calls.filter((c) => c.method === 'PUT')).toHaveLength(0);
      mode = 'normal';
      await page
        .getByRole('button', { name: '관심 상태 다시 확인', exact: true })
        .click();
      await expect(
        page.getByRole('button', { name: '관심 등록', exact: true }),
      ).toBeVisible();
      mode = 'write-error';
      await page
        .getByRole('button', { name: '관심 등록', exact: true })
        .click();
      await expect(page.getByRole('alert')).toBeVisible();
      await expect(
        page.getByRole('button', { name: '관심 등록', exact: true }),
      ).toBeVisible();
      mode = 'normal';
      await page
        .getByRole('button', { name: '관심 등록', exact: true })
        .dblclick();
      await expect(
        page.getByRole('button', { name: '관심 해제', exact: true }),
      ).toBeVisible();
      expect(calls.filter((c) => c.method === 'PUT')).toHaveLength(2);
    });

    test('paginates without precision loss and recovers list errors and empty state', async ({
      page,
    }, testInfo) => {
      await page.goto('/mypage/saved-auctions');
      const list = page.getByRole('list', {
        name: '관심 경매 목록',
        exact: true,
      });
      await expect(list.getByRole('article')).toHaveCount(20);
      await expect(
        list
          .getByRole('article')
          .first()
          .getByText('9,007,199,254,740,995원', { exact: true }),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: testInfo.outputPath('saved-' + device.name + '.png'),
      });
      await page
        .getByRole('link', { name: '다음 페이지', exact: true })
        .click();
      await expect(page).toHaveURL(/cursor=9007199254740995/);
      await expect(list.getByRole('article')).toHaveCount(2);
      await page.getByRole('link', { name: '처음으로', exact: true }).click();
      await expect(list.getByRole('article')).toHaveCount(20);
      mode = 'list-error';
      await page.getByRole('button', { name: '새로고침', exact: true }).click();
      await expect(
        page.getByRole('heading', { name: '관심 경매를 불러오지 못했습니다' }),
      ).toBeVisible();
      mode = 'normal';
      await page.getByRole('button', { name: '새로고침', exact: true }).click();
      await expect(list.getByRole('article')).toHaveCount(20);
      saved.clear();
      await page.getByRole('button', { name: '새로고침', exact: true }).click();
      await expect(
        page.getByRole('heading', { name: '저장한 관심 경매가 없습니다' }),
      ).toBeVisible();
      await expect(
        page.getByRole('link', { name: '경매 둘러보기' }),
      ).toBeVisible();
      expect(calls.some((c) => c.path.includes('/checkout'))).toBe(false);
      expect(
        calls
          .filter((c) => c.path.startsWith(root + '/saved'))
          .every((c) => c.method === 'GET'),
      ).toBe(true);
    });

    test('clears a rejected cookie before sign-in from detail and list', async ({
      page,
      context,
      baseURL,
    }) => {
      for (const entry of ['/auctions/' + ids[0], '/mypage/saved-auctions']) {
        await context.addCookies([
          {
            name: 'accessToken',
            value: 'expired-fixture-token',
            url: baseURL!,
          },
          {
            name: 'refreshToken',
            value: 'expired-fixture-refresh',
            url: baseURL!,
          },
          { name: 'memberUuid', value: 'member-fixture', url: baseURL! },
        ]);
        await page.goto(entry);
        const name = entry.startsWith('/auctions/')
          ? '로그인하고 관심 등록'
          : '로그인하기';
        await page
          .getByRole('link', { name, exact: true })
          .or(page.getByRole('button', { name, exact: true }))
          .click();
        await expect(page).toHaveURL(/\/sign-in(?:\?|$)/);
        expect(
          (await context.cookies()).some((cookie) =>
            ['accessToken', 'refreshToken', 'memberUuid'].includes(cookie.name),
          ),
        ).toBe(false);
      }
      expect(
        calls.some((call) => call.method === 'PUT' || call.method === 'DELETE'),
      ).toBe(false);
    });

    test('offers sign-in when anonymous and does not request another private state', async ({
      page,
      context,
    }) => {
      await context.clearCookies();
      await page.goto('/auctions/' + ids[0]);
      await expect(
        page.getByRole('button', { name: '로그인하고 관심 등록' }),
      ).toBeVisible();
      expect(calls.some((c) => c.path.endsWith('/saved'))).toBe(false);
      await page.getByRole('button', { name: '로그인하고 관심 등록' }).click();
      await expect(page).toHaveURL(/\/sign-in\?redirect=/);
      await page.goto('/mypage/saved-auctions');
      await expect(page).toHaveURL(/\/sign-in/);
    });
  });
}
