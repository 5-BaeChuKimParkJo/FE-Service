import { createServer, type Server } from 'node:http';
import {
  test,
  expect,
  devices,
  type Page,
  type TestInfo,
} from '@playwright/test';

// Start Next with API_URL=http://127.0.0.1:34421 and COOKIE_SECURE=false.
const apiPort = Number(process.env.POPULAR_MOCK_API_PORT ?? 34421);
const auctionUuid = '123e4567-e89b-42d3-a456-426614174001';
let server: Server;
let ranking: 'normal' | 'empty' | 'error';
let latestError: boolean;
let trackingError: boolean;
let rankingDelay: number;
let latestDelay: number;
let calls: {
  method: string;
  path: string;
  body: unknown;
  authorization?: string;
}[];

const popularItems = Array.from({ length: 10 }, (_, index) => ({
  rank: index + 1,
  auctionUuid:
    index === 0
      ? auctionUuid
      : `123e4567-e89b-42d3-a456-4266141740${String(index + 1).padStart(2, '0')}`,
  title:
    index === 0
      ? '인기 무선 이어폰'
      : index === 1
        ? '아주 긴 경매 상품명과 구성품 안내 '.repeat(8)
        : `인기 경매 ${index + 1}`,
  thumbnailUrl: '/images/dummy/airpods.png',
  minimumBid: '9007199254740993',
  currentBid: index === 0 ? '9007199254740995' : '0',
  startAt: '2026-01-01T00:00:00Z',
  endAt: '2099-01-01T00:00:00Z',
  uniqueViewers: '9007199254740997',
  uniqueBidders: '2',
  score: '9007199254741007',
}));

test.beforeAll(async () => {
  server = createServer(async (request, response) => {
    const chunks: Buffer[] = [];
    for await (const chunk of request) chunks.push(Buffer.from(chunk));
    const raw = Buffer.concat(chunks).toString();
    const url = new URL(request.url ?? '/', `http://127.0.0.1:${apiPort}`);
    const path = url.pathname;
    calls.push({
      method: request.method ?? 'GET',
      path,
      body: raw ? JSON.parse(raw) : null,
      authorization: request.headers.authorization,
    });
    response.setHeader('Content-Type', 'application/json');
    const send = (data: unknown, status = 200) => {
      response.statusCode = status;
      response.end(JSON.stringify(data));
    };
    if (path.endsWith('/categories'))
      return send([
        {
          categoryId: 1,
          name: 'Fixture category',
          description: 'Local picker fixture',
          imageUrl: '/images/dummy/airpods.png',
        },
      ]);
    if (path.endsWith('/auctions/popular')) {
      await new Promise((resolve) => setTimeout(resolve, rankingDelay));
      if (ranking === 'error')
        return send(
          { code: 'UNAVAILABLE', message: 'Fixture ranking error' },
          503,
        );
      return send({
        items: ranking === 'empty' ? [] : popularItems,
        generatedAt: ranking === 'empty' ? null : '2026-10-20T00:00:00Z',
        windowHours: 24,
      });
    }
    if (path.endsWith('/auction/search')) {
      await new Promise((resolve) => setTimeout(resolve, latestDelay));
      if (latestError)
        return send(
          { code: 'UNAVAILABLE', message: 'Fixture latest error' },
          503,
        );
      return send({
        getAuctionSearchResponseVoList: [
          {
            id: 'latest-fixture',
            auctionUuid: 'latest-fixture',
            auctionTitle: '최신 경매 상품',
            auctionDescription: '최신 상품',
            status: 'active',
            thumbnailKey: '',
            directDealLocation: null,
            thumbnailUrl: '/images/dummy/dummy1.png',
            images: [],
            sellerUuid: 'seller-fixture',
            startAt: '2026-01-01T00:00:00Z',
            endAt: '2099-01-01T00:00:00Z',
            version: 1,
            createdAt: '2026-10-20T00:00:00Z',
            viewCount: 0,
            currentBid: 0,
            minimumBid: 1000,
            description: null,
            productCondition: 'GOOD',
            categoryId: 1,
            categoryName: '기타',
            categoryDescription: '',
            categoryThumbnailKey: '',
            tagId: [],
            tagNames: [],
            directDeal: false,
          },
        ],
      });
    }
    if (path.endsWith('/views')) {
      if (trackingError)
        return send(
          { code: 'UNAVAILABLE', message: 'Fixture tracking error' },
          503,
        );
      response.writeHead(204);
      return response.end();
    }
    if (path.endsWith('/bidders')) return send({ items: [], nextCursor: null });
    if (path === `/auction-service/api/v1/auctions/${auctionUuid}`)
      return send({
        auctionUuid,
        title: '인기 무선 이어폰',
        description: '경매 상품 설명',
        minimumBid: 1000,
        startAt: '2026-01-01T00:00:00Z',
        endAt: '2099-01-01T00:00:00Z',
        isDirectDeal: false,
        status: 'active',
        productCondition: 'GOOD',
        viewCount: 3,
        thumbnailUrl: '/images/dummy/airpods.png',
        createdAt: '2026-01-01T00:00:00Z',
        sellerUuid: 'seller-fixture',
        tagIds: [],
        tagNames: [],
        categoryName: '기타',
        images: [],
      });
    if (path === '/member-service/api/v1/member/seller-fixture')
      return send({
        memberUuid: 'seller-fixture',
        nickname: '판매자',
        honor: 'NICE_GUY',
        state: 'ACTIVE',
        profileImageUrl: null,
      });
    // An invalid detail never mounts the browser tracker.
    if (path.includes('/auctions/'))
      return send({ code: 'NOT_FOUND', message: 'Auction not found' }, 404);
    return send({ code: 'UNEXPECTED_FIXTURE_REQUEST', message: path }, 404);
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

test.beforeEach(async ({ context }) => {
  ranking = 'normal';
  latestError = false;
  trackingError = false;
  rankingDelay = 0;
  latestDelay = 0;
  calls = [];
  await context.route('**/*', (route) => {
    const host = new URL(route.request().url()).hostname;
    return host === 'localhost' || host === '127.0.0.1'
      ? route.continue()
      : route.abort();
  });
});

async function screenshot(page: Page, info: TestInfo, name: string) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: info.outputPath(`${name}.png`),
    fullPage: true,
  });
  await info.attach(name, {
    path: info.outputPath(`${name}.png`),
    contentType: 'image/png',
  });
}

for (const viewport of [
  { name: 'desktop', width: 1440, height: 1000, isMobile: false },
  { name: 'mobile', width: 390, height: 844, isMobile: true },
]) {
  test.describe(viewport.name, () => {
    test.use({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.isMobile,
      hasTouch: viewport.isMobile,
      deviceScaleFactor: 1,
      userAgent:
        devices[viewport.isMobile ? 'Pixel 7' : 'Desktop Chrome'].userAgent,
      timezoneId: 'Asia/Seoul',
    });

    test('date and hour selection survive confirmation, reopening and cancellation', async ({
      page,
      context,
    }) => {
      await page.clock.setFixedTime(new Date('2030-05-10T01:15:00Z'));
      await context.addCookies([
        {
          name: 'accessToken',
          value: 'fixture-picker-token',
          url: test.info().project.use.baseURL!,
        },
      ]);
      await page.goto('/auctions/create');
      await page.getByRole('textbox').first().fill('Picker fixture auction');
      await page.getByRole('button', { name: /^미개봉 상품/ }).click();
      await page.locator('button[aria-haspopup="dialog"]').click();
      await page.getByRole('button', { name: 'Fixture category' }).click();
      await page.locator('input[type="file"]').setInputFiles({
        name: 'fixture.png',
        mimeType: 'image/png',
        buffer: Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j5N8AAAAASUVORK5CYII=',
          'base64',
        ),
      });
      await page
        .getByPlaceholder('상품에 대한 자세한 설명을 입력해주세요')
        .fill('Local fixture only');
      await page.getByRole('button', { name: '다음 단계로 이동' }).click();
      const trigger = page.getByLabel(/^선택된 날짜:/);
      await trigger.click();
      const selectSlide = async (panel: string, index: number) => {
        const slider = page.locator(`${panel} .swiper`);
        await expect(slider).toHaveClass(/swiper-initialized/);
        await slider.evaluate((element, value) => {
          const swiper = (
            element as HTMLElement & {
              swiper: { slideTo: (index: number, speed: number) => void };
            }
          ).swiper;
          swiper.slideTo(value, 0);
        }, index);
      };
      await selectSlide('#date-panel', 2);
      await page.getByRole('tab', { name: '시간 선택' }).click();
      await selectSlide('#time-panel', 14);
      await page.getByRole('button', { name: '확인', exact: true }).click();
      await expect(trigger).toHaveAttribute(
        'aria-label',
        /2030년 5월 12일.*오후 02:00/,
      );
      await trigger.click();
      await expect(page.locator('#time-panel .swiper-slide-active')).toHaveText(
        '14:00',
      );
      await page.getByRole('tab', { name: '날짜 선택' }).click();
      await expect(
        page.locator('#date-panel .swiper-slide-active'),
      ).toContainText('2일 후');
      await selectSlide('#date-panel', 3);
      await page.getByRole('button', { name: '취소', exact: true }).click();
      await expect(trigger).toHaveAttribute(
        'aria-label',
        /2030년 5월 12일.*오후 02:00/,
      );
      expect(
        calls.some(
          (call) =>
            call.method === 'POST' &&
            /auctions$|presigned|payments/.test(call.path),
        ),
      ).toBe(false);
    });

    test('shows the server TOP10, exact prices, accessible ranks and working detail links', async ({
      page,
    }, info) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto('/');
      const popular = page.getByRole('region', {
        name: '최근 24시간 인기 경매 TOP 10',
      });
      await expect(popular.getByRole('listitem')).toHaveCount(10);
      await expect(popular.getByRole('link').first()).toHaveAccessibleName(
        /1위.*인기 무선 이어폰/,
      );
      await expect(popular.getByRole('link').last()).toHaveAccessibleName(
        /10위.*인기 경매 10/,
      );
      await expect(popular.getByRole('link').first()).toHaveAttribute(
        'href',
        `/auctions/${auctionUuid}`,
      );
      expect(
        await popular
          .getByRole('link')
          .first()
          .evaluate((element) =>
            parseFloat(getComputedStyle(element).borderTopLeftRadius),
          ),
      ).toBeLessThanOrEqual(8);
      await expect(
        popular.getByText('9,007,199,254,740,995원', { exact: true }),
      ).toBeVisible();
      await expect(
        popular
          .getByRole('link')
          .nth(1)
          .getByText('9,007,199,254,740,993원', { exact: true }),
      ).toBeAttached();
      await expect(popular.locator('time')).toHaveAttribute(
        'datetime',
        '2026-10-20T00:00:00Z',
      );
      await expect(
        page.getByRole('link').filter({ hasText: '최신 경매 상품' }),
      ).toBeVisible();
      await expect(popular.locator('img').first()).toBeVisible();
      for (const card of await popular.getByRole('link').all()) {
        await card.scrollIntoViewIfNeeded();
        await expect(card.locator('img')).toBeVisible();
        await expect
          .poll(() =>
            card
              .locator('img')
              .evaluate(
                (img) =>
                  (img as HTMLImageElement).complete &&
                  (img as HTMLImageElement).naturalWidth > 0,
              ),
          )
          .toBe(true);
        expect(
          await card.evaluate(
            (element) => element.scrollWidth <= element.clientWidth,
          ),
        ).toBe(true);
      }
      await popular.getByRole('link').first().scrollIntoViewIfNeeded();
      await screenshot(page, info, `${viewport.name}-popular`);
      await popular.getByRole('link').nth(1).scrollIntoViewIfNeeded();
      await expect(
        popular.getByRole('heading', { name: /^아주 긴 경매 상품명/ }),
      ).toBeVisible();
      await screenshot(page, info, `${viewport.name}-long-title`);
      await popular.getByRole('link').last().scrollIntoViewIfNeeded();
      await screenshot(page, info, `${viewport.name}-popular-end`);
      await popular.getByRole('link').first().scrollIntoViewIfNeeded();
      // Link prefetches and server rendering must not POST a view.
      expect(calls.filter((call) => call.path.endsWith('/views'))).toHaveLength(
        0,
      );
      await popular.getByRole('link').first().click();
      await expect(
        page.getByRole('heading', { name: '인기 무선 이어폰', exact: true }),
      ).toBeVisible();
      await expect
        .poll(() => calls.filter((call) => call.path.endsWith('/views')).length)
        .toBe(1);
      const viewCall = calls.find((call) => call.path.endsWith('/views'))!;
      expect(viewCall.body).toEqual({
        visitorUuid: expect.stringMatching(/^[0-9a-f-]{36}$/i),
      });
      expect(errors).toEqual([]);
    });

    test('empty activity has no fabricated ranking and keeps latest available', async ({
      page,
    }, info) => {
      ranking = 'empty';
      await page.goto('/');
      const popular = page.getByRole('region', {
        name: '최근 24시간 인기 경매 TOP 10',
      });
      await expect(
        popular.getByText('아직 인기 경매가 없습니다.'),
      ).toBeVisible();
      await expect(popular.getByRole('link')).toHaveCount(0);
      await expect(popular.locator('time')).toHaveCount(0);
      await expect(
        page.getByRole('link').filter({ hasText: '최신 경매 상품' }),
      ).toBeVisible();
      await screenshot(page, info, `${viewport.name}-empty`);
    });

    test('ranking error and retry leave latest usable', async ({
      page,
    }, info) => {
      ranking = 'error';
      await page.goto('/');
      const popular = page.getByRole('region', {
        name: '최근 24시간 인기 경매 TOP 10',
      });
      await expect(popular.getByRole('alert')).toBeVisible();
      await expect(
        page.getByRole('link').filter({ hasText: '최신 경매 상품' }),
      ).toBeVisible();
      await screenshot(page, info, `${viewport.name}-error`);
      ranking = 'normal';
      await popular
        .getByRole('button', { name: '인기 경매 다시 불러오기' })
        .click();
      await expect(popular.getByRole('listitem')).toHaveCount(10);
      await expect(popular.getByRole('alert')).toHaveCount(0);
    });

    test('ranking loading does not block latest; latest error does not block ranking', async ({
      page,
    }, info) => {
      rankingDelay = 1200;
      await page.goto('/');
      const popular = page.getByRole('region', {
        name: '최근 24시간 인기 경매 TOP 10',
      });
      await expect(
        popular.getByRole('status', { name: '인기 경매 불러오는 중' }),
      ).toBeVisible();
      await expect(
        page.getByRole('link').filter({ hasText: '최신 경매 상품' }),
      ).toBeVisible();
      await screenshot(page, info, `${viewport.name}-loading`);
      await expect(popular.getByRole('listitem')).toHaveCount(10);
      latestError = true;
      rankingDelay = 0;
      await page.reload();
      await expect(popular.getByRole('listitem')).toHaveCount(10);
      const latest = page.getByRole('region', { name: '전체 경매 상품' });
      await expect(latest.getByRole('alert')).toBeVisible();
      latestError = false;
      await latest
        .getByRole('button', { name: '최신 경매 다시 불러오기' })
        .click();
      await expect(
        latest.getByRole('link').filter({ hasText: '최신 경매 상품' }),
      ).toBeVisible();
    });
  });
}

test('SSR does not track; failed tracking preserves detail; reload and revisit keep the same visitor', async ({
  page,
  context,
}) => {
  trackingError = true;
  const response = await context.request.get(`/auctions/${auctionUuid}`);
  expect(response.ok()).toBe(true);
  expect(calls.filter((call) => call.path.endsWith('/views'))).toHaveLength(0);
  await page.goto(`/auctions/${auctionUuid}`);
  await expect(
    page.getByRole('heading', { name: '인기 무선 이어폰', exact: true }),
  ).toBeVisible();
  await expect
    .poll(() => calls.filter((call) => call.path.endsWith('/views')).length)
    .toBe(1);
  const visitorCookie = (await context.cookies()).find(
    (cookie) => cookie.name === 'auctionVisitorUuid',
  )!;
  expect(visitorCookie).toMatchObject({
    httpOnly: true,
    sameSite: 'Lax',
    secure: false,
  });
  expect(visitorCookie.expires - Date.now() / 1000).toBeGreaterThan(29 * 86400);
  expect(await page.evaluate(() => document.cookie)).not.toContain(
    'auctionVisitorUuid',
  );
  trackingError = false;
  await page.reload();
  await expect
    .poll(() => calls.filter((call) => call.path.endsWith('/views')).length)
    .toBe(2);
  await page.goto('/');
  await page
    .getByRole('region', { name: '최근 24시간 인기 경매 TOP 10' })
    .getByRole('link')
    .first()
    .click();
  await expect
    .poll(() => calls.filter((call) => call.path.endsWith('/views')).length)
    .toBe(3);
  expect(
    calls
      .filter((call) => call.path.endsWith('/views'))
      .map((call) => call.body),
  ).toEqual(
    Array.from({ length: 3 }, () => ({ visitorUuid: visitorCookie.value })),
  );
});

test('unsuccessful detail never records a visit', async ({ page }) => {
  await page.goto('/auctions/missing-fixture');
  await expect(
    page.getByRole('heading', { name: '인기 무선 이어폰', exact: true }),
  ).toHaveCount(0);
  expect(calls.filter((call) => call.path.endsWith('/views'))).toHaveLength(0);
});

test('refreshes ranking after five minutes without reloading latest', async ({
  page,
}) => {
  await page.clock.install();
  await page.goto('/');
  const popular = page.getByRole('region', {
    name: '최근 24시간 인기 경매 TOP 10',
  });
  await expect(popular.getByRole('listitem')).toHaveCount(10);
  const latestCalls = calls.filter((call) =>
    call.path.endsWith('/auction/search'),
  ).length;
  const rankingCalls = calls.filter((call) =>
    call.path.endsWith('/auctions/popular'),
  ).length;
  ranking = 'empty';
  await page.clock.fastForward('05:01');
  await expect(popular.getByText('아직 인기 경매가 없습니다.')).toBeVisible();
  expect(
    calls.filter((call) => call.path.endsWith('/auctions/popular')).length,
  ).toBe(rankingCalls + 1);
  expect(
    calls.filter((call) => call.path.endsWith('/auction/search')).length,
  ).toBe(latestCalls);
});

test('authenticated tracking forwards only the bearer identity contract', async ({
  page,
  context,
}) => {
  await context.addCookies([
    {
      name: 'accessToken',
      value: 'fixture-verified-jwt',
      url: test.info().project.use.baseURL!,
    },
    {
      name: 'memberUuid',
      value: 'untrusted-browser-member',
      url: test.info().project.use.baseURL!,
    },
  ]);
  await page.goto(`/auctions/${auctionUuid}`);
  await expect(
    page.getByRole('heading', { name: '인기 무선 이어폰', exact: true }),
  ).toBeVisible();
  await expect
    .poll(() => calls.filter((call) => call.path.endsWith('/views')).length)
    .toBe(1);
  expect(calls.find((call) => call.path.endsWith('/views'))).toMatchObject({
    method: 'POST',
    body: {},
    authorization: 'Bearer fixture-verified-jwt',
  });
  expect(
    (await context.cookies()).find(
      (cookie) => cookie.name === 'auctionVisitorUuid',
    ),
  ).toBeUndefined();
});
