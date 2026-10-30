import { createServer, type Server } from 'node:http';
import { test, expect } from '@playwright/test';

// Next production server: API_URL=http://127.0.0.1:34425. No real identities or mutations.
const root = '/auction-service/api/v1/auctions/mine';
const rows = Array.from({ length: 24 }, (_, i) => ({
  auctionUuid: '20000000-0000-4000-8000-' + String(i + 1).padStart(12, '0'),
  title: i === 0 ? '내 경매 카메라와 교환 렌즈 세트' : '내 경매 ' + String(i),
  thumbnailUrl: '/images/dummy/airpods.png',
  minimumBid: '9007199254740993',
  currentBid: String(BigInt('9007199254740993') + BigInt(i)),
  bidCount: i + 1,
  startAt: '2020-01-01T00:00:00Z',
  endAt: new Date(Date.UTC(2099, 0, i + 1)).toISOString(),
  createdAt: new Date(Date.UTC(2026, 9, i + 1)).toISOString(),
  status:
    i === 1
      ? 'hidden'
      : i === 2
        ? 'cancelled'
        : i === 3
          ? 'waiting'
          : i === 4
            ? 'ended'
            : 'active',
}));
let server: Server;
let mode: 'normal' | 'error' | 'empty' | 'malformed';
let calls: Array<{ method: string; path: string }>;
test.beforeAll(async () => {
  server = createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://fixture');
    calls.push({
      method: request.method ?? 'GET',
      path: url.pathname + url.search,
    });
    response.setHeader('Content-Type', 'application/json');
    const send = (value: unknown, status = 200) => {
      response.statusCode = status;
      response.end(JSON.stringify(value));
    };
    if (url.pathname === root) {
      if (request.headers.authorization !== 'Bearer fake-sales-token')
        return send(
          { code: 'HTTP_ERROR_401', message: 'Fixture unauthorized' },
          401,
        );
      if (mode === 'error')
        return send({ code: 'FAILED', message: 'Private fixture error' }, 503);
      const own = mode === 'empty' ? [] : rows;
      const summary = {
        total: own.length,
        waiting: 0,
        active: 0,
        ended: 0,
        hidden: 0,
        cancelled: 0,
      };
      for (const row of own)
        summary[row.status as keyof Omit<typeof summary, 'total'>]++;
      const q = (url.searchParams.get('q') ?? '').toLowerCase();
      const status = url.searchParams.get('status') ?? 'all';
      const sort = url.searchParams.get('sort') ?? 'recent';
      const page = Number(url.searchParams.get('page') ?? '1');
      const filtered = own.filter(
        (row) =>
          row.title.toLowerCase().includes(q) &&
          (status === 'all' || row.status === status),
      );
      filtered.sort((a, b) =>
        sort === 'ending'
          ? a.endAt.localeCompare(b.endAt)
          : sort === 'price'
            ? BigInt(a.currentBid) > BigInt(b.currentBid)
              ? -1
              : BigInt(a.currentBid) < BigInt(b.currentBid)
                ? 1
                : b.auctionUuid.localeCompare(a.auctionUuid)
            : b.createdAt.localeCompare(a.createdAt),
      );
      const items = filtered.slice((page - 1) * 20, page * 20);
      return send({
        summary,
        total: filtered.length,
        page,
        pageSize: 20,
        items:
          mode === 'malformed' && items.length
            ? [{ ...items[0], currentBid: 123 }]
            : items,
      });
    }
    if (url.pathname.endsWith('/categories')) return send([]);
    if (url.pathname.startsWith('/member-service'))
      return send({
        nickname: 'Fixture',
        memberUuid: 'member-fixture',
        profileImageUrl: null,
        point: 0,
      });
    return send({ code: 'NOT_FOUND', message: 'Unconfigured fixture' }, 404);
  });
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(
      Number(process.env.MY_SALES_MOCK_PORT ?? 34425),
      '127.0.0.1',
      resolve,
    );
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
  await context.addCookies([
    { name: 'accessToken', value: 'fake-sales-token', url: baseURL! },
    { name: 'memberUuid', value: 'member-fixture', url: baseURL! },
  ]);
});
test.afterEach(async ({ page }, info) => {
  if (info.status !== info.expectedStatus)
    console.log(
      JSON.stringify({ failedUrl: page.url(), fixtureCalls: calls.slice(-12) }),
    );
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
    test('renders exact prices, summary, sorted paging and out-of-range recovery', async ({
      page,
    }) => {
      await page.goto('/mypage/sales');
      await expect(
        page.getByRole('heading', { name: '내 경매', exact: true }),
      ).toBeVisible();
      await expect(page.getByLabel('전체 경매 수', { exact: true })).toHaveText(
        '24',
      );
      const list = page.getByRole('list', {
        name: '내 경매 목록',
        exact: true,
      });
      await expect(list.getByRole('article')).toHaveCount(20);
      await expect(
        list.getByText('9,007,199,254,741,016원', { exact: true }),
      ).toBeVisible();
      await page
        .getByRole('link', { name: '다음 페이지', exact: true })
        .click();
      await expect(list.getByRole('article')).toHaveCount(4);
      await expect(page).toHaveURL(/page=2/);
      await page
        .getByRole('link', { name: '이전 페이지', exact: true })
        .click();
      await expect(list.getByRole('article')).toHaveCount(20);
      await page.getByLabel('정렬', { exact: true }).selectOption('ending');
      await page.getByRole('button', { name: '조회', exact: true }).click();
      await expect(
        list.getByRole('article').first().getByRole('heading'),
      ).toHaveText(rows[0].title);
      await page
        .getByRole('link', { name: '다음 페이지', exact: true })
        .click();
      expect(new URL(page.url()).searchParams.get('sort')).toBe('ending');
      await expect(page.getByLabel('정렬', { exact: true })).toHaveValue(
        'ending',
      );
      await page.goto('/mypage/sales?page=9&sort=ending');
      await expect(
        page.getByRole('heading', { name: '이 페이지에는 경매가 없습니다' }),
      ).toBeVisible();
      await page.getByRole('link', { name: '처음으로', exact: true }).click();
      await expect(list.getByRole('article')).toHaveCount(20);
      expect(new URL(page.url()).searchParams.has('page')).toBe(false);
      expect(calls.every((call) => call.method === 'GET')).toBe(true);
    });
    test('searches and resets filters, distinguishes private states and fits the viewport', async ({
      page,
    }, info) => {
      await page.goto('/mypage/sales?page=2');
      await page.getByLabel('경매 제목 검색', { exact: true }).fill('카메라');
      await page.getByRole('button', { name: '조회', exact: true }).click();
      expect(new URL(page.url()).searchParams.has('page')).toBe(false);
      await expect(page.getByRole('article')).toHaveCount(1);
      await expect(page.getByLabel('전체 경매 수', { exact: true })).toHaveText(
        '24',
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: info.outputPath('my-sales-' + device.name + '.png'),
        fullPage: true,
      });
      await page
        .getByLabel('경매 제목 검색', { exact: true })
        .fill('no-match-fixture');
      await page.getByRole('button', { name: '조회', exact: true }).click();
      await expect(
        page.getByRole('heading', { name: '조건에 맞는 경매가 없습니다' }),
      ).toBeVisible();
      await page
        .getByRole('link', { name: '조건 초기화', exact: true })
        .click();
      await page
        .getByLabel('경매 상태', { exact: true })
        .selectOption('hidden');
      await page.getByRole('button', { name: '조회', exact: true }).click();
      await expect(page.getByRole('article')).toHaveCount(1);
      await expect(page.getByRole('article').getByRole('link')).toHaveCount(0);
      await expect(
        page.getByText('숨김·취소 경매는 공개 상세를 제공하지 않습니다.'),
      ).toBeVisible();
      expect(
        calls.some(
          (call) =>
            call.path.includes('/checkout') || call.path.includes('/bidders'),
        ),
      ).toBe(false);
    });
    test('separates failures from empty state and refreshes without writes', async ({
      page,
    }) => {
      mode = 'error';
      await page.goto('/mypage/sales');
      await expect(
        page.getByRole('heading', { name: '내 경매를 불러오지 못했습니다' }),
      ).toBeVisible();
      await expect(
        page.getByRole('heading', { name: '아직 등록한 경매가 없습니다' }),
      ).toHaveCount(0);
      await expect(page.getByText('Private fixture error')).toHaveCount(0);
      mode = 'normal';
      await page.getByRole('link', { name: '새로고침', exact: true }).click();
      await expect(page.getByRole('article')).toHaveCount(20);
      mode = 'malformed';
      await page.getByRole('link', { name: '새로고침', exact: true }).click();
      await expect(
        page.getByRole('heading', { name: '내 경매를 불러오지 못했습니다' }),
      ).toBeVisible();
      mode = 'empty';
      await page.getByRole('link', { name: '새로고침', exact: true }).click();
      await expect(
        page.getByRole('heading', { name: '아직 등록한 경매가 없습니다' }),
      ).toBeVisible();
      await expect(
        page.getByRole('link', { name: '경매 등록하기', exact: true }),
      ).toBeVisible();
      expect(calls.every((call) => call.method === 'GET')).toBe(true);
    });
    test('requires authentication and clears rejected cookies for sign-in recovery', async ({
      page,
      context,
      baseURL,
    }) => {
      await context.clearCookies();
      await page.goto('/mypage/sales');
      await expect(page).toHaveURL(/\/sign-in(?:\?|$)/);
      expect(calls.some((call) => call.path.startsWith(root))).toBe(false);
      await context.addCookies([
        { name: 'accessToken', value: 'expired-sales-token', url: baseURL! },
        { name: 'refreshToken', value: 'expired-refresh-token', url: baseURL! },
        { name: 'memberUuid', value: 'member-fixture', url: baseURL! },
      ]);
      await page.goto('/mypage/sales');
      await page
        .getByRole('button', { name: '로그인하기', exact: true })
        .click();
      await expect(page).toHaveURL(/\/sign-in(?:\?|$)/);
      expect(
        (await context.cookies()).some((cookie) =>
          ['accessToken', 'refreshToken', 'memberUuid'].includes(cookie.name),
        ),
      ).toBe(false);
    });
  });
}
