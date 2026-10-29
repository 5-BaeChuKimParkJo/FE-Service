import { createServer, type Server } from 'node:http';
import { test, expect } from '@playwright/test';
import {
  bidHistoryFixture,
  bidHistoryScenario,
} from '../src/test/bidHistoryFixture';

// Start Next with API_URL=http://127.0.0.1:34423. No live API is used.
const apiPort = Number(process.env.BID_HISTORY_MOCK_API_PORT ?? 34423);
const pagePath = '/mypage/purchases';
let server: Server;
let mode: 'normal' | 'empty' | 'error' = 'normal';
let records = bidHistoryScenario();
let reads = 0;
let methods: string[] = [];
let paths: string[] = [];

test.beforeAll(async () => {
  server = createServer((request, response) => {
    const path = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;
    methods.push(request.method ?? 'GET');
    paths.push(path);
    response.setHeader('Content-Type', 'application/json');
    const send = (body: unknown, status = 200) => {
      response.statusCode = status;
      response.end(JSON.stringify(body));
    };
    if (path.endsWith('/auctions/my-bids')) {
      reads++;
      if (request.headers.authorization !== 'Bearer fake-history-token')
        return send(
          { code: 'UNAUTHORIZED', message: 'Fixture unauthorized' },
          401,
        );
      if (mode === 'error')
        return send({ code: 'UNAVAILABLE', message: 'Fixture outage' }, 503);
      return send(mode === 'empty' ? [] : records);
    }
    if (path.endsWith('/categories')) return send([]);
    if (path === '/member-service/api/v1/member')
      return send({
        memberUuid: 'history-member',
        nickname: '체험 사용자',
        profileImageUrl: null,
        point: 100,
        state: 'ACTIVE',
      });
    return send(
      { code: 'NOT_FOUND', message: 'Unconfigured fixture route' },
      404,
    );
  });
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(apiPort, '127.0.0.1', resolve);
  });
});
test.afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
});
test.beforeEach(async ({ context, baseURL }) => {
  mode = 'normal';
  records = bidHistoryScenario();
  reads = 0;
  methods = [];
  paths = [];
  await context.addCookies([
    { name: 'accessToken', value: 'fake-history-token', url: baseURL! },
    { name: 'memberUuid', value: 'history-member', url: baseURL! },
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

    test('groups history, searches, filters, expands and refreshes without financial calls', async ({
      page,
    }, testInfo) => {
      const longTitle = '기계식 키보드 ' + '긴 상품명과 구성품 안내 '.repeat(5);
      records = records.map((row) =>
        row.auction.auctionUuid === 'auction-keyboard'
          ? { ...row, auction: { ...row.auction, title: longTitle } }
          : row,
      );
      await page.goto(pagePath);
      const list = page.getByRole('list', {
        name: '참여 경매 목록',
        exact: true,
      });
      await expect(list.getByRole('article')).toHaveCount(2);
      await expect(
        page.getByText('2개 경매 표시', { exact: true }),
      ).toBeVisible();
      const keyboard = page.getByRole('article', { name: longTitle });
      await expect(
        keyboard.getByRole('definition').filter({ hasText: '12,000원' }),
      ).toBeVisible();
      await expect(
        keyboard.getByRole('definition').filter({ hasText: '15,000원' }),
      ).toBeVisible();
      await expect(
        keyboard.getByText('총 2회 입찰', { exact: true }),
      ).toBeVisible();
      const ended = page.getByRole('article', { name: '무선 헤드폰' });
      await expect(ended.getByText('종료', { exact: true })).toBeVisible();
      await expect(ended.getByText('낙찰', { exact: true })).toHaveCount(0);
      await expect(
        ended.getByRole('link', { name: '상세 · 결제 확인' }),
      ).toHaveAttribute('href', '/auctions/auction-headphones');
      await keyboard.getByText('입찰 기록 2회', { exact: true }).click();
      const bids = keyboard.getByRole('list', {
        name: longTitle + ' 입찰 기록',
      });
      await expect(bids.getByRole('listitem')).toHaveCount(2);
      await expect(bids.getByRole('listitem').first()).toContainText('19:00');
      await expect(bids.getByRole('listitem').first()).toContainText(
        '12,000원',
      );
      await page.getByLabel('경매 제목 검색', { exact: true }).fill(' 키보드 ');
      await expect(list.getByRole('article')).toHaveCount(1);
      await page.getByLabel('경매 상태', { exact: true }).selectOption('ended');
      await expect(
        page.getByText('조건에 맞는 경매가 없습니다', { exact: true }),
      ).toBeVisible();
      await page.getByRole('button', { name: '조건 초기화' }).click();
      await expect(list.getByRole('article')).toHaveCount(2);
      await page.getByLabel('정렬', { exact: true }).selectOption('amount');
      await expect(list.getByRole('article').first()).toHaveAccessibleName(
        longTitle,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect
        .poll(() =>
          page
            .getByRole('heading', { name: '참여한 거래', exact: true })
            .first()
            .evaluate((heading) => {
              for (
                let element: Element | null = heading;
                element;
                element = element.parentElement
              ) {
                const filter = getComputedStyle(element).filter;
                if (filter !== 'none' && filter !== 'blur(0px)') return false;
              }
              return true;
            }),
        )
        .toBe(true);
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      await page.screenshot({
        path: testInfo.outputPath(`my-bids-${device.name}.png`),
        fullPage: true,
      });
      const previousReads = reads;
      records.push(
        bidHistoryFixture({
          bidderUuid: 'refreshed-bid',
          bidAmount: 13000,
          createdAt: '2026-10-29T14:00:00Z',
          version: 3,
          title: longTitle,
        }),
      );
      await page.getByRole('button', { name: '새로고침', exact: true }).click();
      await expect.poll(() => reads).toBeGreaterThan(previousReads);
      await expect(
        keyboard.getByText('총 3회 입찰', { exact: true }),
      ).toBeVisible();
      expect(methods.every((method) => method === 'GET')).toBe(true);
      expect(paths.some((path) => path.includes('/checkout'))).toBe(false);
    });

    test('shows a real empty history with a browse link', async ({ page }) => {
      mode = 'empty';
      await page.goto(pagePath);
      await expect(
        page.getByRole('heading', { name: '참여한 거래가 없습니다' }),
      ).toBeVisible();
      await expect(
        page.getByRole('link', { name: '경매 둘러보기' }),
      ).toHaveAttribute('href', '/auctions');
      expect(
        await page
          .getByRole('link', { name: '경매 둘러보기' })
          .evaluate((link) => getComputedStyle(link).backgroundColor),
      ).not.toBe('rgba(0, 0, 0, 0)');
      await expect(
        page.getByLabel('경매 제목 검색', { exact: true }),
      ).toHaveCount(0);
    });

    test('distinguishes an API outage from no history and retries successfully', async ({
      page,
    }) => {
      mode = 'error';
      await page.goto(pagePath);
      await expect(
        page.getByRole('heading', { name: '거래 내역을 불러오지 못했습니다' }),
      ).toBeVisible();
      await expect(
        page.getByRole('heading', { name: '참여한 거래가 없습니다' }),
      ).toHaveCount(0);
      mode = 'normal';
      await page
        .getByRole('button', { name: '다시 시도', exact: true })
        .click();
      await expect(
        page
          .getByRole('list', { name: '참여 경매 목록', exact: true })
          .getByRole('article'),
      ).toHaveCount(2);
    });
  });
}
