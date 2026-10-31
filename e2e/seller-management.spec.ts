import { createServer, type Server } from 'node:http';
import { test, expect } from '@playwright/test';
import type { SellerAuctionData } from '../src/types/auction/seller-management';
const id = '10000000-0000-4000-8000-000000000001';
const root = '/auction-service/api/v1/auctions/' + id + '/seller';
let server: Server;
let row: SellerAuctionData;
let mode: 'normal' | 'conflict' | 'error' | 'denied';
let writes: Array<{
  method: string;
  body: Record<string, unknown>;
  path: string;
}>;
const base = (): SellerAuctionData => ({
  auctionUuid: id,
  title: '판매자 관리 테스트 경매',
  description: '기존 설명',
  minimumBid: '1000',
  startAt: '2098-01-01T00:00:00.000Z',
  endAt: '2098-01-02T00:00:00.000Z',
  version: 0,
  status: 'waiting',
  editable: true,
  history: [],
});
test.beforeAll(async () => {
  server = createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://fixture');
    response.setHeader('Content-Type', 'application/json');
    const send = (value: unknown, status = 200) => {
      response.statusCode = status;
      response.end(JSON.stringify(value));
    };
    if (url.pathname === root && request.method === 'GET')
      return mode === 'denied'
        ? send({ code: 'HTTP_ERROR_404', message: 'private-owner-detail' }, 404)
        : send(row);
    if (url.pathname === root || url.pathname === root + '/cancel') {
      let raw = '';
      request.on('data', (part) => {
        raw += part;
      });
      request.on('end', () => {
        const body = JSON.parse(raw || '{}');
        writes.push({ method: request.method!, body, path: url.pathname });
        if (mode === 'conflict')
          return send(
            { code: 'HTTP_ERROR_409', message: 'private-stale-detail' },
            409,
          );
        if (mode === 'error')
          return send(
            { code: 'FAILED', message: 'private-database-detail' },
            500,
          );
        if (body.version !== row.version)
          return send({ code: 'HTTP_ERROR_409', message: 'stale' }, 409);
        const before = {
          title: row.title,
          description: row.description,
          minimumBid: row.minimumBid,
          startAt: row.startAt,
          endAt: row.endAt,
          status: 'visible',
        };
        const cancel = url.pathname.endsWith('/cancel');
        if (cancel) {
          row.status = 'cancelled';
          row.editable = false;
        } else
          for (const key of [
            'title',
            'description',
            'minimumBid',
            'startAt',
            'endAt',
          ] as const)
            row[key] = body[key];
        row.version++;
        row.history.unshift({
          action: cancel ? 'cancel' : 'update',
          reasonCode: body.reasonCode ?? null,
          reasonDetail: body.reasonDetail ?? null,
          before,
          after: {
            title: row.title,
            description: row.description,
            minimumBid: row.minimumBid,
            startAt: row.startAt,
            endAt: row.endAt,
            status: cancel ? 'cancelled' : 'visible',
          },
          createdAt: '2026-10-31T01:00:00Z',
        });
        setTimeout(() => send({ ok: true }), 120);
      });
      return;
    }
    if (url.pathname.endsWith('/auctions/mine'))
      return send({
        summary: {
          total: 1,
          waiting: 1,
          active: 0,
          ended: 0,
          hidden: 0,
          cancelled: 0,
        },
        total: 1,
        page: 1,
        pageSize: 20,
        items: [
          {
            ...row,
            thumbnailUrl: '/images/dummy/airpods.png',
            currentBid: '0',
            bidCount: 0,
            createdAt: '2026-10-31T00:00:00Z',
          },
        ],
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
    server.listen(34427, '127.0.0.1', resolve);
  });
});
test.afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
});
test.beforeEach(async ({ context, baseURL }) => {
  row = base();
  mode = 'normal';
  writes = [];
  await context.addCookies([
    {
      name: 'accessToken',
      value: 'fake-seller-management-token',
      url: baseURL!,
    },
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
    test('opens management from own card with KST fields and no overflow', async ({
      page,
    }, info) => {
      await page.goto('/mypage/sales');
      await page.getByRole('link', { name: '경매 관리', exact: true }).click();
      await expect(
        page.getByRole('heading', { name: '경매 관리', exact: true }),
      ).toBeVisible();
      await expect(
        page.getByLabel('시작 시각 (KST)', { exact: true }),
      ).toHaveValue('2098-01-01T09:00');
      await expect(page.getByLabel('시작가 (원)', { exact: true })).toHaveValue(
        '1000',
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: info.outputPath('seller-management-' + device.name + '.png'),
        fullPage: true,
        animations: 'disabled',
      });
      expect(writes).toHaveLength(0);
    });
    test('saves five fields once and displays persisted history after document navigation', async ({
      page,
    }) => {
      await page.goto('/mypage/sales/' + id);
      await page
        .getByLabel('경매 제목', { exact: true })
        .fill('수정 완료된 카메라 경매');
      await page
        .getByLabel('상품 설명', { exact: true })
        .fill('업데이트한 설명');
      await page.getByLabel('시작가 (원)', { exact: true }).fill('2500');
      await page
        .getByLabel('시작 시각 (KST)', { exact: true })
        .fill('2098-01-02T03:00');
      await page
        .getByLabel('종료 시각 (KST)', { exact: true })
        .fill('2098-01-03T03:00');
      await page
        .getByRole('button', { name: '수정 저장', exact: true })
        .evaluate((button: HTMLButtonElement) => {
          button.click();
          button.click();
        });
      await expect(
        page.getByRole('region', { name: '판매자 변경 이력' }),
      ).toContainText('경매 정보 수정');
      expect(writes).toHaveLength(1);
      expect(writes[0]).toEqual({
        method: 'PATCH',
        path: root,
        body: {
          version: 0,
          title: '수정 완료된 카메라 경매',
          description: '업데이트한 설명',
          minimumBid: '2500',
          startAt: '2098-01-01T18:00:00.000Z',
          endAt: '2098-01-02T18:00:00.000Z',
        },
      });
      await expect(page.getByLabel('경매 제목', { exact: true })).toHaveValue(
        '수정 완료된 카메라 경매',
      );
    });
    test('requires other detail and confirmation and cancels only once with retained history', async ({
      page,
    }) => {
      await page.goto('/mypage/sales/' + id);
      const cancel = page.getByRole('button', {
        name: '출품 취소',
        exact: true,
      });
      await expect(cancel).toBeDisabled();
      await page.getByLabel('취소 사유', { exact: true }).selectOption('other');
      await expect(page.getByLabel('기타 사유', { exact: true })).toBeVisible();
      await page
        .getByLabel('기타 사유', { exact: true })
        .fill('설명에 오류가 있어 다시 준비합니다');
      await page.getByLabel('출품 취소 내용을 확인했습니다').check();
      await cancel.evaluate((button: HTMLButtonElement) => {
        button.click();
        button.click();
      });
      await expect(
        page.getByRole('region', { name: '판매자 변경 이력' }),
      ).toContainText('설명에 오류가 있어 다시 준비합니다');
      await expect(
        page.getByRole('button', { name: '수정 저장', exact: true }),
      ).toHaveCount(0);
      expect(writes).toHaveLength(1);
      expect(writes[0].body).toEqual({
        version: 0,
        reasonCode: 'other',
        reasonDetail: '설명에 오류가 있어 다시 준비합니다',
      });
      expect(row.status).toBe('cancelled');
    });
    test('clears obsolete free text when switching to a predefined reason', async ({
      page,
    }) => {
      await page.goto('/mypage/sales/' + id);
      await page.getByLabel('취소 사유', { exact: true }).selectOption('other');
      await page
        .getByLabel('기타 사유', { exact: true })
        .fill('제외할 임시 문구');
      await page
        .getByLabel('취소 사유', { exact: true })
        .selectOption('schedule_change');
      await expect(page.getByLabel('기타 사유', { exact: true })).toHaveCount(
        0,
      );
      await page.getByLabel('출품 취소 내용을 확인했습니다').check();
      await page
        .getByRole('button', { name: '출품 취소', exact: true })
        .click();
      await expect(
        page.getByRole('region', { name: '판매자 변경 이력' }),
      ).toContainText('경매 일정 변경');
      expect(writes[0].body).toEqual({
        version: 0,
        reasonCode: 'schedule_change',
      });
    });
    test('shows stale/failed results safely with reload and no automatic retry', async ({
      page,
    }) => {
      mode = 'conflict';
      await page.goto('/mypage/sales/' + id);
      await page
        .getByRole('button', { name: '수정 저장', exact: true })
        .click();
      await expect(
        page.getByRole('alert', { name: '경매 변경 결과' }),
      ).toContainText('경매가 변경되었거나 시작되었습니다');
      await expect(
        page.getByRole('link', { name: '최신 상태 확인' }),
      ).toBeVisible();
      expect(writes).toHaveLength(1);
      expect(await page.locator('body').innerText()).not.toContain('private');
      mode = 'error';
      await page
        .getByRole('button', { name: '수정 저장', exact: true })
        .click();
      await expect(
        page.getByRole('alert', { name: '경매 변경 결과' }),
      ).toContainText('처리 결과를 확인하지 못했습니다');
      expect(writes).toHaveLength(2);
      expect(await page.locator('body').innerText()).not.toContain('private');
    });
    test('keeps started auction read-only and refuses non-owned detail', async ({
      page,
    }) => {
      row.status = 'active';
      row.editable = false;
      await page.goto('/mypage/sales/' + id);
      await expect(
        page.getByText('수정·취소할 수 없는 경매입니다', { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: '수정 저장', exact: true }),
      ).toHaveCount(0);
      mode = 'denied';
      await page.reload();
      await expect(
        page.getByRole('heading', { name: '경매를 불러오지 못했습니다' }),
      ).toBeVisible();
      await expect(
        page.getByText('관리할 수 있는 경매를 찾지 못했습니다.', {
          exact: true,
        }),
      ).toBeVisible();
      expect(writes).toHaveLength(0);
    });
    test('redirects anonymous owners to sign-in without submitting a mutation', async ({
      page,
      context,
    }) => {
      await context.clearCookies();
      await page.goto('/mypage/sales/' + id);
      await expect(page).toHaveURL(/\/sign-in\?redirect=/);
      expect(new URL(page.url()).searchParams.get('redirect')).toBe(
        '/mypage/sales/' + id,
      );
      expect(writes).toHaveLength(0);
    });
  });
}
