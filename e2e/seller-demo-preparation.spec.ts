import { createServer, type Server } from 'node:http';
import { test, expect } from '@playwright/test';
import type { MySale } from '../src/types/auction/my-sales';
const oldId = '10000000-0000-4000-8000-000000000001',
  preparedId = '10000000-0000-4000-8000-000000000002';
const api = '/auction-service/api/v1/auctions/seller-demo';
let server: Server, prepared: boolean, createdCount: number, requests: number;
let mode:
  | 'normal'
  | 'ordinary'
  | 'availability-error'
  | 'cooldown'
  | 'unknown-response';
const row = (id: string, status: 'ended' | 'waiting'): MySale => ({
  auctionUuid: id,
  title:
    status === 'waiting'
      ? '[DEMO] 판매자 수정·취소 체험'
      : '[DEMO] 기존 종료 경매',
  thumbnailUrl: '/images/dummy/airpods.png',
  minimumBid: '1000',
  currentBid: '0',
  bidCount: 0,
  startAt:
    status === 'waiting' ? '2098-01-01T00:00:00Z' : '2020-01-01T00:00:00Z',
  endAt: status === 'waiting' ? '2098-01-02T00:00:00Z' : '2020-01-02T00:00:00Z',
  createdAt: '2026-11-01T00:00:00Z',
  status,
});
test.beforeAll(async () => {
  server = createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://fixture');
    response.setHeader('Content-Type', 'application/json');
    const send = (value: unknown, status = 200) => {
      response.statusCode = status;
      response.end(JSON.stringify(value));
    };
    if (url.pathname === api && request.method === 'GET')
      return mode === 'availability-error'
        ? send({ code: 'UNAVAILABLE', message: 'private-availability' }, 503)
        : send({ available: mode !== 'ordinary' });
    if (url.pathname === api && request.method === 'POST') {
      let raw = '';
      request.on('data', (part) => {
        raw += part;
      });
      request.on('end', () => {
        requests++;
        const body = JSON.parse(raw);
        if (Object.keys(body).length) return send({ code: 'BAD_REQUEST' }, 400);
        if (mode === 'ordinary') return send({ code: 'HTTP_ERROR_403' }, 403);
        if (mode === 'cooldown')
          return send(
            { code: 'SELLER_DEMO_COOLDOWN', message: 'private-cooldown' },
            429,
          );
        const status = prepared ? 'reused' : 'created';
        if (!prepared) {
          prepared = true;
          createdCount++;
        }
        if (mode === 'unknown-response')
          return send(
            { code: 'HTTP_ERROR_504', message: 'private-unknown-outcome' },
            504,
          );
        setTimeout(() => send({ auctionUuid: preparedId, status }), 120);
      });
      return;
    }
    if (url.pathname === '/auction-service/api/v1/auctions/mine') {
      const items = [
        row(oldId, 'ended'),
        ...(prepared ? [row(preparedId, 'waiting')] : []),
      ];
      return send({
        summary: {
          total: items.length,
          waiting: prepared ? 1 : 0,
          active: 0,
          ended: 1,
          hidden: 0,
          cancelled: 0,
        },
        total: items.length,
        page: 1,
        pageSize: 20,
        items,
      });
    }
    if (
      url.pathname ===
        '/auction-service/api/v1/auctions/' + preparedId + '/seller' &&
      prepared
    )
      return send({
        ...row(preparedId, 'waiting'),
        description: '체험용 설명',
        version: 0,
        editable: true,
        history: [],
      });
    if (url.pathname.endsWith('/categories')) return send([]);
    if (url.pathname.startsWith('/member-service'))
      return send({
        memberUuid: 'seller-fixture',
        nickname: '판매자 체험',
        profileImageUrl: null,
        point: 0,
      });
    return send({ code: 'NOT_FOUND', message: 'unconfigured fixture' }, 404);
  });
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(
      Number(process.env.SELLER_DEMO_MOCK_PORT ?? 34428),
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
  prepared = false;
  createdCount = 0;
  requests = 0;
  await context.addCookies([
    { name: 'accessToken', value: 'seller-demo-fixture-token', url: baseURL! },
    { name: 'memberUuid', value: 'seller-fixture', url: baseURL! },
  ]);
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
    test('prepares once despite rapid clicks and opens an editable management form', async ({
      page,
    }, info) => {
      await page.goto('/mypage/sales');
      const button = page.getByRole('button', {
        name: '판매자 데모 준비',
        exact: true,
      });
      await expect(button).toBeEnabled();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: info.outputPath('demo-preparation-' + device.name + '.png'),
        fullPage: true,
        animations: 'disabled',
      });
      await button.evaluate((node: HTMLButtonElement) => {
        node.click();
        node.click();
      });
      await expect(page).toHaveURL(
        new RegExp('/mypage/sales/' + preparedId + '$'),
      );
      await expect(
        page.getByRole('button', { name: '수정 저장', exact: true }),
      ).toBeEnabled();
      await expect(page.getByLabel('경매 제목', { exact: true })).toHaveValue(
        '[DEMO] 판매자 수정·취소 체험',
      );
      expect(requests).toBe(1);
      expect(createdCount).toBe(1);
    });
    test('reuses an existing editable demo without making another listing', async ({
      page,
    }) => {
      prepared = true;
      await page.goto('/mypage/sales');
      await page
        .getByRole('button', { name: '판매자 데모 준비', exact: true })
        .click();
      await expect(page).toHaveURL(
        new RegExp('/mypage/sales/' + preparedId + '$'),
      );
      expect(requests).toBe(1);
      expect(createdCount).toBe(0);
    });
    test('requires an explicit retry after unknown outcome and then reuses the committed resource', async ({
      page,
    }) => {
      mode = 'unknown-response';
      await page.goto('/mypage/sales');
      await page
        .getByRole('button', { name: '판매자 데모 준비', exact: true })
        .click();
      await expect(
        page.getByRole('alert', { name: '데모 준비 결과' }),
      ).toContainText('처리 결과를 확인하지 못했습니다');
      expect(requests).toBe(1);
      expect(createdCount).toBe(1);
      expect(await page.locator('body').innerText()).not.toContain('private');
      mode = 'normal';
      await page
        .getByRole('button', { name: '판매자 데모 준비', exact: true })
        .click();
      await expect(page).toHaveURL(
        new RegExp('/mypage/sales/' + preparedId + '$'),
      );
      expect(requests).toBe(2);
      expect(createdCount).toBe(1);
    });
    test('explains cooldown without retrying a write or losing the original list', async ({
      page,
    }) => {
      mode = 'cooldown';
      await page.goto('/mypage/sales');
      await page
        .getByRole('button', { name: '판매자 데모 준비', exact: true })
        .click();
      await expect(
        page.getByRole('alert', { name: '데모 준비 결과' }),
      ).toContainText('1분 뒤');
      await expect(
        page.getByRole('link', { name: '내 경매 확인', exact: true }),
      ).toBeVisible();
      expect(requests).toBe(1);
      expect(createdCount).toBe(0);
      await expect(page.getByRole('article')).toHaveCount(1);
    });
    test('hides preparation for ordinary users and distinguishes an unavailable state request', async ({
      page,
    }) => {
      mode = 'ordinary';
      await page.goto('/mypage/sales');
      await expect(
        page.getByRole('button', { name: '판매자 데모 준비', exact: true }),
      ).toHaveCount(0);
      await expect(
        page.getByRole('alert', { name: '판매자 데모 준비 상태' }),
      ).toHaveCount(0);
      mode = 'availability-error';
      await page.reload();
      await expect(
        page.getByRole('alert', { name: '판매자 데모 준비 상태' }),
      ).toContainText('데모 준비 상태를 확인하지 못했습니다');
      await expect(
        page.getByRole('button', { name: '판매자 데모 준비', exact: true }),
      ).toHaveCount(0);
      expect(requests).toBe(0);
      expect(await page.locator('body').innerText()).not.toContain('private');
    });
  });
}
