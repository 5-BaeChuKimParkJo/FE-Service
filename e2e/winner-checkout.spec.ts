import { createServer, type Server } from 'node:http';
import { test, expect, type Page, type TestInfo } from '@playwright/test';
import { checkoutFixture } from '../src/test/checkout-fixture';
import type { CheckoutView } from '../src/types/auction/checkout';

// Run with API_URL=http://127.0.0.1:34420 on the Next process. All provider code is intercepted.
const apiPort = Number(process.env.CHECKOUT_MOCK_API_PORT ?? 34420);
const path = '/auctions/auction-test-123/checkout';
let server: Server;
let view: CheckoutView;
let scenario: 'normal' | 'unknown-confirm' | 'confirm-error' = 'normal';
let calls: { method: string; path: string; body: unknown }[] = [];
let shortDemo = false;
let demoEnd = 0;
let detailReads = 0;

const fakeSdk = `
window.__tossCalls = [];
window.TossPayments = function(clientKey) {
  window.__tossCalls.push(['init', clientKey]);
  return { widgets: function(options) {
    window.__tossCalls.push(['widgets', options]);
    let value;
    return {
      setAmount: async function(amount) { value = amount.value; window.__tossCalls.push(['amount', amount]); },
      renderPaymentMethods: async function(options) {
        window.__tossCalls.push(['methods']);
        const container = document.querySelector(options.selector);
        container.innerHTML = '<label style="display:block;padding:16px"><input type="radio" checked name="method"> 테스트 카드</label>';
        return { destroy: async function() { container.replaceChildren(); } };
      },
      renderAgreement: async function(options) {
        window.__tossCalls.push(['agreement']);
        const container = document.querySelector(options.selector);
        container.innerHTML = '<label style="display:block;padding:16px"><input type="checkbox" checked> 필수 약관 동의</label>';
        const checkbox = container.querySelector('input');
        return {
          getAgreementStatus: async function() { return { agreedRequiredTerms: checkbox.checked }; },
          on: function(name, callback) { checkbox.onchange = function() { callback({ agreedRequiredTerms: checkbox.checked }); }; },
          destroy: async function() { container.replaceChildren(); }
        };
      },
      requestPayment: async function(options) {
        window.__tossCalls.push(['request', options]);
        if (window.__rejectToss) throw new Error('interrupted');
        const url = new URL(options.successUrl);
        url.searchParams.set('orderId', options.orderId);
        url.searchParams.set('paymentKey', 'fake-payment-key');
        url.searchParams.set('amount', String(value));
        window.location.assign(url.href);
      }
    };
  } };
};`;

test.beforeAll(async () => {
  server = createServer(async (request, response) => {
    const chunks: Buffer[] = [];
    for await (const chunk of request) chunks.push(Buffer.from(chunk));
    const raw = Buffer.concat(chunks).toString();
    const body: unknown = raw ? JSON.parse(raw) : null;
    const url = request.url ?? '';
    response.setHeader('Content-Type', 'application/json');
    function send(data: unknown, status = 200) {
      response.statusCode = status;
      response.end(JSON.stringify(data));
    }
    if (url.includes('/checkout')) {
      calls.push({ method: request.method ?? 'GET', path: url, body });
      if (request.headers.authorization !== 'Bearer fake-winner-token')
        return send({ code: 'HTTP_ERROR_403', message: 'winner only' }, 403);
      if (request.method === 'POST' && url.endsWith('/confirm')) {
        if (scenario !== 'normal') {
          view.purchase!.attempt!.status = 'UNKNOWN';
          return send(
            scenario === 'confirm-error'
              ? { code: 'TIMEOUT_ERROR', message: 'fake lost response' }
              : view,
            scenario === 'confirm-error' ? 504 : 200,
          );
        }
        view.purchase!.status = 'PAID';
        view.purchase!.attempt!.status = 'DONE';
        view.purchase!.paidAt = '2026-10-17T12:00:00.000Z';
        view.eligible = false;
        view.clientKey = null;
      } else if (request.method === 'POST' && url.endsWith('/reconcile')) {
        if (scenario === 'unknown-confirm' || scenario === 'confirm-error') {
          view.purchase!.status = 'PAID';
          view.purchase!.attempt!.status = 'DONE';
          view.eligible = false;
          view.clientKey = null;
        }
      } else if (request.method === 'POST') {
        view = checkoutFixture();
      }
      return send(view);
    }
    if (url.endsWith('/categories')) return send([]);
    if (url.endsWith('/bidders')) return send({ items: [], nextCursor: null });
    if (url === '/auction-service/api/v1/auctions/auction-test-123') {
      detailReads++;
      if (shortDemo && !demoEnd) demoEnd = Date.now() + 8000;
      return send({
        isDemo: shortDemo,
        auctionUuid: 'auction-test-123',
        title: '테스트 경매 상품',
        description: '경매 상품 설명',
        minimumBid: 1000,
        startAt: shortDemo
          ? new Date(demoEnd - 300000).toISOString()
          : '2026-01-01T00:00:00Z',
        endAt: shortDemo
          ? new Date(demoEnd).toISOString()
          : '2026-01-02T00:00:00Z',
        isDirectDeal: false,
        status: shortDemo && Date.now() < demoEnd ? 'active' : 'ended',
        productCondition: 'GOOD',
        viewCount: 3,
        thumbnailUrl: '',
        createdAt: '2026-01-01T00:00:00Z',
        sellerUuid: 'seller-test',
        tagIds: [],
        tagNames: [],
        categoryName: '기타',
        images: [],
      });
    }
    if (url === '/member-service/api/v1/member/seller-test')
      return send({
        memberUuid: 'seller-test',
        nickname: '판매자',
        honor: 'NICE_GUY',
        state: 'ACTIVE',
        profileImageUrl: null,
      });
    return send(0);
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
  view = checkoutFixture({ purchase: null });
  scenario = 'normal';
  calls = [];
  shortDemo = false;
  demoEnd = 0;
  detailReads = 0;
  await context.addCookies([
    {
      name: 'accessToken',
      value: 'fake-winner-token',
      url: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    },
  ]);
  await context.route('**/*', async (route) => {
    const url = route.request().url();
    if (url === 'https://js.tosspayments.com/v2/standard')
      return route.fulfill({
        contentType: 'application/javascript',
        body: fakeSdk,
      });
    if (
      new URL(url).hostname === 'localhost' ||
      new URL(url).hostname === '127.0.0.1'
    )
      return route.continue();
    return route.abort();
  });
});

async function shot(page: Page, info: TestInfo, name: string) {
  await expect(page.locator('h1')).toBeVisible();
  await expect
    .poll(() =>
      page.locator('h1').evaluate((heading) => {
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
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
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
  { name: 'mobile', width: 390, height: 844, isMobile: true },
  { name: 'desktop', width: 1440, height: 1000, isMobile: false },
]) {
  test.describe(viewport.name, () => {
    test.use({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.isMobile,
    });

    test('short demo refreshes once after expiry and keeps checkout restricted to an authenticated winner', async ({
      page,
      context,
    }, info) => {
      shortDemo = true;
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto('/auctions/auction-test-123');
      const guide = page.getByRole('region', { name: '체험 경매 안내' });
      await expect(
        guide.getByRole('heading', { name: '5분 체험 경매' }),
      ).toBeVisible();
      await expect(guide).toContainText('경매 진행 중');
      await expect(
        page.getByRole('link', { name: '낙찰 상품 테스트 결제' }),
      ).toHaveCount(0);
      await shot(page, info, `${viewport.name}-demo-active`);
      await expect(guide).toContainText('경매가 마감되었습니다', {
        timeout: 20000,
      });
      await expect(
        page.getByRole('link', { name: '낙찰 상품 테스트 결제' }),
      ).toBeVisible();
      const readsAfterExpiry = detailReads;
      await page.waitForTimeout(1800);
      expect(detailReads).toBe(readsAfterExpiry);
      expect(calls.filter((call) => call.method === 'POST')).toHaveLength(0);
      await shot(page, info, `${viewport.name}-demo-ended`);
      await context.clearCookies();
      await page.reload();
      await expect(guide).toContainText('경매가 마감되었습니다');
      await expect(
        page.getByRole('link', { name: '낙찰 상품 테스트 결제' }),
      ).toHaveCount(0);
      expect(errors).toEqual([]);
    });

    test('explicit prepare, prechecked agreement, confirmed PAID and success refresh', async ({
      page,
    }, info) => {
      const errors: string[] = [];
      page.on('pageerror', (error) =>
        errors.push(`${page.url()}: ${error.message}`),
      );
      await page.goto(path);
      await expect(
        page.getByRole('button', { name: '테스트 결제 준비' }),
      ).toBeVisible();
      expect(calls.filter((call) => call.method === 'POST')).toHaveLength(0);
      expect(await page.locator('#toss-payments-v2-standard').count()).toBe(0);
      await shot(page, info, `${viewport.name}-prepare`);
      await page.getByRole('button', { name: '테스트 결제 준비' }).click();
      await expect(
        page.getByRole('button', { name: '테스트 결제하기' }),
      ).toBeEnabled();
      await shot(page, info, `${viewport.name}-widgets`);
      await page.getByRole('checkbox', { name: '필수 약관 동의' }).uncheck();
      await expect(
        page.getByRole('button', { name: '테스트 결제하기' }),
      ).toBeDisabled();
      await page.getByRole('checkbox', { name: '필수 약관 동의' }).check();
      await page.getByRole('button', { name: '테스트 결제하기' }).click();
      await expect(
        page.getByRole('heading', { name: '결제가 완료되었습니다' }),
      ).toBeVisible();
      expect(calls.filter((call) => call.path.endsWith('/confirm'))).toEqual([
        {
          method: 'POST',
          path: '/auction-service/api/v1/auctions/auction-test-123/checkout/confirm',
          body: {
            orderId: 'order_test_123',
            paymentKey: 'fake-payment-key',
            amount: '15000',
          },
        },
      ]);
      await shot(page, info, `${viewport.name}-paid`);
      await page.reload();
      await expect(
        page.getByRole('heading', { name: '결제가 완료되었습니다' }),
      ).toBeVisible();
      expect(
        calls.filter((call) => call.path.endsWith('/confirm')),
      ).toHaveLength(1);
      expect(errors).toEqual([]);
    });

    test('pending cancellation stays pending and reconciles without another payment', async ({
      page,
    }, info) => {
      view = checkoutFixture({ eligible: false, clientKey: null });
      view.purchase!.status = 'PAID';
      view.purchase!.attempt!.status = 'CANCELING';
      await page.goto(path);
      await expect(
        page.getByRole('heading', { name: '결제 취소 상태 확인' }),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: '테스트 결제 준비' }),
      ).toHaveCount(0);
      await expect(
        page.getByRole('heading', { name: '결제가 완료되었습니다' }),
      ).toHaveCount(0);
      await shot(page, info, `${viewport.name}-canceling`);
      await page.getByRole('button', { name: '결제 상태 확인' }).click();
      await expect(
        page.getByRole('button', { name: '결제 상태 확인' }),
      ).toBeEnabled();
      expect(
        calls.filter((call) => call.method === 'POST').map((call) => call.path),
      ).toEqual([
        '/auction-service/api/v1/auctions/auction-test-123/checkout/reconcile',
      ]);
      view.purchase!.status = 'CANCELED';
      view.purchase!.attempt!.status = 'CANCELED';
      await page.getByRole('button', { name: '결제 상태 확인' }).click();
      await expect(
        page.getByRole('heading', { name: '취소된 주문입니다' }),
      ).toBeVisible();
      await shot(page, info, `${viewport.name}-canceled`);
    });

    test('lost confirmation is recovered by reconcile with no new prepare', async ({
      page,
    }, info) => {
      scenario = 'confirm-error';
      view = checkoutFixture();
      await page.goto(
        `${path}/success?orderId=order_test_123&paymentKey=fake-payment-key&amount=15000`,
      );
      await expect(
        page.getByRole('button', { name: '다시 불러오기' }),
      ).toBeVisible();
      await expect(
        page.getByRole('heading', { name: '결제가 완료되었습니다' }),
      ).toHaveCount(0);
      await shot(page, info, `${viewport.name}-unknown`);
      await page.getByRole('button', { name: '다시 불러오기' }).click();
      await page.getByRole('button', { name: '결제 상태 확인' }).click();
      await expect(
        page.getByRole('heading', { name: '결제가 완료되었습니다' }),
      ).toBeVisible();
      expect(
        calls.filter((call) => call.method === 'POST').map((call) => call.path),
      ).toEqual([
        '/auction-service/api/v1/auctions/auction-test-123/checkout/confirm',
        '/auction-service/api/v1/auctions/auction-test-123/checkout/reconcile',
      ]);
    });

    test('failure, SDK load retry and interrupted request require a state check', async ({
      page,
    }, info) => {
      view = checkoutFixture();
      await page.goto(`${path}/fail?code=FORGED&message=forged-success`);
      await expect(page.getByText('forged-success')).toHaveCount(0);
      expect(calls.filter((call) => call.method === 'POST')).toHaveLength(0);
      await shot(page, info, `${viewport.name}-failed`);
      await page.getByRole('button', { name: '결제 상태 확인' }).click();
      await page.route('https://js.tosspayments.com/v2/standard', (route) =>
        route.abort(),
      );
      await page.getByRole('button', { name: '테스트 결제 준비' }).click();
      await expect(
        page.getByRole('button', { name: '결제 수단 다시 불러오기' }),
      ).toBeVisible();
      await shot(page, info, `${viewport.name}-sdk-error`);
      await page.unroute('https://js.tosspayments.com/v2/standard');
      await page
        .getByRole('button', { name: '결제 수단 다시 불러오기' })
        .click();
      await expect(
        page.getByRole('button', { name: '테스트 결제하기' }),
      ).toBeEnabled();
      await page.evaluate('window.__rejectToss = true');
      await page.getByRole('button', { name: '테스트 결제하기' }).click();
      await expect(
        page.getByRole('button', { name: '결제 상태 확인' }),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: '테스트 결제하기' }),
      ).toHaveCount(0);
    });

    test('rejects forged success and preserves owned receipt entry', async ({
      page,
    }, info) => {
      view = checkoutFixture();
      await page.goto(
        `${path}/success?orderId=order_test_123&paymentKey=fake-payment-key&amount=99999`,
      );
      await expect(
        page.getByRole('button', { name: '다시 불러오기' }),
      ).toBeVisible();
      expect(
        calls.filter((call) => call.path.endsWith('/confirm')),
      ).toHaveLength(0);
      view = checkoutFixture({ eligible: false, clientKey: null });
      view.purchase!.status = 'PAID';
      view.purchase!.attempt!.status = 'DONE';
      await page.goto('/auctions/auction-test-123');
      await expect(
        page.getByRole('link', { name: '결제 내역 보기' }),
      ).toBeVisible();
      await shot(page, info, `${viewport.name}-winner-entry`);
    });
  });
}

test('all three server renders only GET; anonymous and nonwinner entries are hidden', async ({
  page,
  context,
}) => {
  view = checkoutFixture();
  for (const url of [
    path,
    `${path}/success?orderId=order_test_123&paymentKey=fake-payment-key&amount=15000`,
    `${path}/fail`,
  ]) {
    const response = await context.request.get(url);
    expect(response.ok()).toBe(true);
  }
  expect(calls.filter((call) => call.method === 'GET')).toHaveLength(3);
  expect(calls.filter((call) => call.method === 'POST')).toHaveLength(0);
  await context.addCookies([
    {
      name: 'accessToken',
      value: 'fake-nonwinner-token',
      url: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    },
  ]);
  await page.goto('/auctions/auction-test-123');
  await expect(page.getByRole('region', { name: '낙찰자 결제' })).toHaveCount(
    0,
  );
  await context.clearCookies();
  await page.goto('/auctions/auction-test-123');
  await expect(
    page.getByRole('heading', { name: '테스트 경매 상품' }),
  ).toBeVisible();
  await expect(page.getByRole('region', { name: '낙찰자 결제' })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole('button', { name: '로그인하고 관심 등록' }),
  ).toBeVisible();
  expect(calls.filter((call) => call.method === 'POST')).toHaveLength(0);
});
