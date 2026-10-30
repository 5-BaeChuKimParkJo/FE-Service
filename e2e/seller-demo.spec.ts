import { createServer, type Server } from 'node:http';
import { test, expect } from '@playwright/test';

// Start Next with API_URL=http://127.0.0.1:34426 and the fixture persona env from docs.
const buyerId = '30000000-0000-4000-8000-000000000001';
const sellerId = '40000000-0000-4000-8000-000000000002';
const rows = ['waiting', 'active', 'ended'].map((status, i) => ({
  auctionUuid: '50000000-0000-4000-8000-' + String(i + 1).padStart(12, '0'),
  title: '[DEMO] 판매자 체험 샘플 ' + (i + 1),
  thumbnailUrl: '/images/dummy/airpods.png',
  minimumBid: '1000',
  currentBid: '0',
  bidCount: 0,
  startAt:
    status === 'waiting' ? '2099-01-01T00:00:00Z' : '2020-01-01T00:00:00Z',
  endAt: status === 'ended' ? '2021-01-01T00:00:00Z' : '2099-01-02T00:00:00Z',
  createdAt: '2026-10-30T00:00:00Z',
  status,
}));
let server: Server;
let failAuth: boolean;
let authCalls: string[];
let mutationCalls: number;
let authDelay: number;
const sellerLabel = '판매자 체험 계정으로 시작하기';
const buyerLabel = '구매자 체험 계정으로 시작하기';

test.beforeAll(async () => {
  server = createServer(async (request, response) => {
    const url = new URL(request.url ?? '/', 'http://fixture');
    const chunks: Buffer[] = [];
    for await (const chunk of request) chunks.push(Buffer.from(chunk));
    response.setHeader('Content-Type', 'application/json');
    const send = (value: unknown, status = 200) => {
      response.statusCode = status;
      response.end(JSON.stringify(value));
    };
    if (
      request.method === 'POST' &&
      url.pathname === '/auth-service/api/v1/auth/sign-in'
    ) {
      const body = JSON.parse(Buffer.concat(chunks).toString());
      const mode =
        body.memberId === 'fixtureseller' &&
        body.password === 'seller-fixture-password'
          ? 'seller'
          : body.memberId === 'fixturebuyer' &&
              body.password === 'buyer-fixture-password'
            ? 'buyer'
            : 'invalid';
      authCalls.push(mode);
      await new Promise((resolve) => setTimeout(resolve, authDelay));
      if (failAuth || mode === 'invalid')
        return send({ code: 'DENIED', message: 'private-fixture-error' }, 401);
      return send({
        accessToken: mode + '-fixture-token',
        refreshToken: mode + '-fixture-refresh',
        memberUuid: mode === 'seller' ? sellerId : buyerId,
      });
    }
    if (request.method === 'POST' && url.pathname.endsWith('/views')) {
      response.statusCode = 204;
      return response.end();
    }
    if (request.method !== 'GET') {
      mutationCalls++;
      return send({ code: 'UNEXPECTED_WRITE' }, 500);
    }
    const seller =
      request.headers.authorization === 'Bearer seller-fixture-token';
    if (url.pathname === '/auction-service/api/v1/auctions/mine') {
      if (
        !seller &&
        request.headers.authorization !== 'Bearer buyer-fixture-token'
      )
        return send({ code: 'HTTP_ERROR_401', message: 'Unauthorized' }, 401);
      return send({
        items: seller ? rows : [],
        summary: {
          total: seller ? 3 : 0,
          waiting: seller ? 1 : 0,
          active: seller ? 1 : 0,
          ended: seller ? 1 : 0,
          hidden: 0,
          cancelled: 0,
        },
        total: seller ? 3 : 0,
        page: 1,
        pageSize: 20,
      });
    }
    if (url.pathname.endsWith('/categories')) return send([]);
    if (url.pathname.endsWith('/bidders'))
      return send({ items: [], nextCursor: null });
    if (url.pathname.endsWith('/saved')) return send({ saved: false });
    if (
      url.pathname ===
      '/auction-service/api/v1/auctions/' + rows[1].auctionUuid
    )
      return send({
        ...rows[1],
        minimumBid: 1000,
        currentBid: 0,
        description: 'Ordinary public demo fixture',
        sellerUuid: sellerId,
        images: [],
        tags: [],
        tagIds: [],
        tagNames: [],
        categoryId: 1,
        categoryName: '기타',
        productCondition: 'used',
        isDirectDeal: false,
        directDealLocation: null,
        viewCount: 0,
      });
    if (url.pathname.startsWith('/member-service'))
      return send({
        memberUuid: seller ? sellerId : buyerId,
        nickname: seller ? '판매자체험' : '구매자체험',
        gradeUuid: 'fixture',
        honor: '0',
        state: 'ACTIVE',
        profileImageUrl: null,
        point: 0,
      });
    if (url.pathname.startsWith('/grade-service'))
      return send({
        gradeUuid: 'fixture',
        name: '회원',
        imageUrl: '/images/dummy/airpods.png',
      });
    if (url.pathname.endsWith('/popular'))
      return send({ items: [], generatedAt: null, windowHours: 24 });
    if (url.pathname.includes('/search'))
      return send({
        getAuctionSearchResponseVoList: [],
      });
    return send({ items: [], nextCursor: null });
  });
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(34426, '127.0.0.1', resolve);
  });
});
test.afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
});
test.beforeEach(() => {
  failAuth = false;
  authCalls = [];
  mutationCalls = 0;
  authDelay = 150;
});
test.afterEach(() => {
  expect(mutationCalls).toBe(0);
});

for (const device of [
  { name: 'desktop', width: 1440, height: 1000, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true },
]) {
  test.describe(device.name, () => {
    test.use({
      viewport: { width: device.width, height: device.height },
      isMobile: device.mobile,
      hasTouch: device.mobile,
    });
    test('offers explicit personas and opens three seller samples without leaking credentials', async ({
      page,
      context,
    }, info) => {
      await page.goto('/sign-in');
      await expect(
        page.getByRole('button', { name: buyerLabel, exact: true }),
      ).toBeEnabled();
      await expect(
        page.getByRole('button', { name: sellerLabel, exact: true }),
      ).toBeEnabled();
      const html = await page.content();
      expect(html).not.toContain('seller-fixture-password');
      expect(html).not.toContain('buyer-fixture-password');
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: info.outputPath('seller-demo-options-' + device.name + '.png'),
        fullPage: true,
        animations: 'disabled',
      });
      await page
        .getByRole('button', { name: sellerLabel, exact: true })
        .click();
      await expect(page).toHaveURL(/\/mypage\/sales$/);
      await expect(
        page.getByRole('heading', { name: '내 경매', exact: true }),
      ).toBeVisible();
      await expect(page.getByRole('article')).toHaveCount(3);
      for (const label of ['대기', '진행', '종료'])
        await expect(
          page.getByLabel(label + ' 경매 수', { exact: true }),
        ).toHaveText('1');
      expect(
        (await context.cookies()).find((cookie) => cookie.name === 'memberUuid')
          ?.value,
      ).toBe(sellerId);
      expect(authCalls).toEqual(['seller']);
    });
    test('buyer remains a distinct account without seller listings', async ({
      page,
      context,
    }) => {
      await page.goto('/sign-in');
      await page.getByRole('button', { name: buyerLabel, exact: true }).click();
      await expect(page).toHaveURL(/\/$/);
      await expect(page.getByText('구매자체험', { exact: true })).toBeVisible();
      expect(
        (await context.cookies()).find((cookie) => cookie.name === 'memberUuid')
          ?.value,
      ).toBe(buyerId);
      await page.goto('/mypage/sales');
      await expect(
        page.getByRole('heading', { name: '아직 등록한 경매가 없습니다' }),
      ).toBeVisible();
      await expect(page.getByRole('article')).toHaveCount(0);
      expect(authCalls).toEqual(['buyer']);
    });
    test('recovers failed login and serializes rapid cross-persona clicks', async ({
      page,
    }) => {
      failAuth = true;
      await page.goto('/sign-in');
      await page
        .getByRole('button', { name: sellerLabel, exact: true })
        .click();
      await expect(
        page
          .getByRole('region', { name: '포트폴리오 체험', exact: true })
          .getByRole('alert'),
      ).toHaveText(
        '체험 계정에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.',
      );
      await expect(page.getByText('private-fixture-error')).toHaveCount(0);
      await expect(
        page.getByRole('button', { name: buyerLabel, exact: true }),
      ).toBeEnabled();
      failAuth = false;
      authDelay = 600;
      authCalls = [];
      await page.evaluate(
        ({ sellerLabel, buyerLabel }) => {
          const buttons = Array.from(document.querySelectorAll('button'));
          buttons
            .find((button) => button.textContent?.includes(sellerLabel))!
            .click();
          buttons
            .find((button) => button.textContent?.includes(buyerLabel))!
            .click();
          buttons
            .find((button) => button.textContent?.includes(sellerLabel))!
            .click();
        },
        { sellerLabel, buyerLabel },
      );
      await expect(
        page.getByRole('button', { name: buyerLabel, exact: true }),
      ).toBeDisabled();
      await expect(page).toHaveURL(/\/mypage\/sales$/);
      await expect(page.getByRole('article')).toHaveCount(3);
      expect(authCalls).toEqual(['seller']);
    });
    test('legacy auction demo button retains buyer persona and original destination', async ({
      page,
      context,
    }) => {
      const path = '/auctions/' + rows[1].auctionUuid;
      await page.goto(path);
      await page
        .getByRole('button', { name: '체험 계정으로 입찰하기', exact: true })
        .click();
      await expect(page).toHaveURL(new RegExp(path + '$'));
      await expect(
        page.getByRole('heading', { name: rows[1].title, exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole('link', { name: '로그인 후 입찰하기', exact: true }),
      ).toHaveCount(0);
      await expect
        .poll(
          async () =>
            (await context.cookies()).find(
              (cookie) => cookie.name === 'memberUuid',
            )?.value,
        )
        .toBe(buyerId);
      await expect(
        page.getByRole('button', {
          name: '체험 계정으로 입찰하기',
          exact: true,
        }),
      ).toHaveCount(0);
      expect(authCalls).toEqual(['buyer']);
    });

    test('home seller entry and repeated sign-in create no samples', async ({
      page,
      context,
    }) => {
      await page.goto('/');
      await page
        .getByRole('button', { name: sellerLabel, exact: true })
        .click();
      await expect(page).toHaveURL(/\/mypage\/sales$/);
      await expect(page.getByRole('article')).toHaveCount(3);
      await context.clearCookies();
      await page.goto('/sign-in');
      await page
        .getByRole('button', { name: sellerLabel, exact: true })
        .click();
      await expect(page).toHaveURL(/\/mypage\/sales$/);
      await expect(page.getByRole('article')).toHaveCount(3);
      expect(authCalls).toEqual(['seller', 'seller']);
    });
  });
}
