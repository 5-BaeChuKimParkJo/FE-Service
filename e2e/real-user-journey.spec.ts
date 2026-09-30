import { expect, Page, test } from '@playwright/test';

test.skip(!process.env.E2E_BASE_URL, 'Set E2E_BASE_URL to run deployed E2E.');

type User = {
  id: string;
  nickname: string;
  password: string;
  phone: string;
};

async function signUp(page: Page, user: User) {
  await page.goto('/sign-up');
  await page.getByPlaceholder('휴대폰 번호').fill(user.phone);
  await page.getByRole('button', { name: '인증번호 발송' }).click();
  await expect(page.getByText('체험용 인증번호:')).toContainText('000000');
  await page.getByPlaceholder('인증번호').fill('000000');
  await page.getByRole('button', { name: '인증 확인' }).click();

  await page.getByPlaceholder('아이디').fill(user.id);
  await expect(page.getByText('사용 가능한 아이디입니다.')).toBeVisible();
  await page.getByPlaceholder('비밀번호', { exact: true }).fill(user.password);
  await page.getByPlaceholder('비밀번호 확인').fill(user.password);
  await page.getByPlaceholder('닉네임').fill(user.nickname);
  await expect(page.getByText('사용 가능한 닉네임입니다.')).toBeVisible();
  await page.getByRole('button', { name: 'NEXT' }).click();
  await page.getByRole('button', { name: '건너뛰고 가입' }).click();
  await page.getByRole('button', { name: '로그인페이지로' }).click();
  await expect(page).toHaveURL(/\/sign-in/);
}

async function signIn(page: Page, user: User) {
  await page.goto('/sign-in');
  await page.getByPlaceholder('your id').fill(user.id);
  await page.getByPlaceholder('password').fill(user.password);
  await page.getByRole('button', { name: 'SIGN IN' }).click();
  await expect(page).toHaveURL(/\/$/);
}

test('two users create, discover, and bid on a persisted auction', async ({
  browser,
}) => {
  const suffix = `${Date.now()}`.slice(-8);
  const seller: User = {
    id: `seller${suffix}`,
    nickname: `판매${suffix.slice(-4)}`,
    password: 'Demo!12345',
    phone: `010${suffix}`,
  };
  const bidder: User = {
    id: `bidder${suffix}`,
    nickname: `입찰${suffix.slice(-4)}`,
    password: 'Demo!12345',
    phone: `011${suffix}`,
  };
  const auctionTitle = `E2E 경매 ${suffix}`;

  const sellerContext = await browser.newContext();
  const sellerPage = await sellerContext.newPage();
  await signUp(sellerPage, seller);
  await signIn(sellerPage, seller);

  await sellerPage.goto('/auctions/create');
  await sellerPage
    .locator('section', { hasText: '제목' })
    .locator('input')
    .fill(auctionTitle);
  await sellerPage.getByRole('button', { name: /중고 상품/ }).click();
  await sellerPage
    .locator('section', { hasText: '카테고리' })
    .getByRole('button')
    .first()
    .click();
  await sellerPage
    .getByRole('heading', { name: '카테고리 선택' })
    .locator('..')
    .locator('..')
    .getByRole('button')
    .nth(1)
    .click();
  await sellerPage.locator('input[type="file"]').setInputFiles({
    name: 'auction.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2nGQAAAAASUVORK5CYII=',
      'base64',
    ),
  });
  await sellerPage.getByLabel('상품 설명').fill('실사용 E2E 검증용 경매입니다.');
  await sellerPage.getByRole('button', { name: '다음 단계로 이동' }).click();
  await sellerPage
    .locator('section', { hasText: '최소 입찰가' })
    .locator('input')
    .fill('10000');
  await sellerPage.getByRole('radio', { name: '1일' }).click();
  await sellerPage.getByRole('button', { name: '다음 단계로 이동' }).click();
  await sellerPage.getByRole('button', { name: '경매 등록 완료' }).click();
  await expect(sellerPage.getByText('경매 등록 완료!')).toBeVisible();
  await sellerPage.getByRole('button', { name: '상세 페이지로 이동' }).click();
  await expect(sellerPage).toHaveURL(/\/auctions\/[0-9a-f-]+/);
  const auctionUrl = sellerPage.url();
  await sellerContext.close();

  const bidderContext = await browser.newContext();
  const bidderPage = await bidderContext.newPage();
  await signUp(bidderPage, bidder);
  await signIn(bidderPage, bidder);

  await bidderPage.goto('/search');
  await bidderPage.getByPlaceholder('어떤 상품을 찾고 계세요?').fill(auctionTitle);
  await bidderPage.getByPlaceholder('어떤 상품을 찾고 계세요?').press('Enter');
  await expect
    .poll(async () => bidderPage.getByText(auctionTitle).count(), {
      timeout: 60_000,
      intervals: [2_000, 5_000],
    })
    .toBeGreaterThan(0);

  await bidderPage.goto(auctionUrl);
  await bidderPage.getByRole('button', { name: '입찰하러가기' }).click();
  await bidderPage.getByRole('button', { name: '동의' }).click();
  await bidderPage.getByPlaceholder('금액을 입력하세요.').fill('11000');
  await bidderPage.getByRole('button', { name: '입찰하기' }).click();
  await bidderPage.getByRole('button', { name: '확인했습니다' }).click();
  await expect(bidderPage.getByText('입찰이 완료되었습니다!')).toBeVisible();
  await bidderContext.close();

  const persistenceContext = await browser.newContext();
  const persistencePage = await persistenceContext.newPage();
  await signIn(persistencePage, bidder);
  await persistencePage.goto(auctionUrl);
  await expect(persistencePage.getByText(auctionTitle)).toBeVisible();
  await persistenceContext.close();
});
