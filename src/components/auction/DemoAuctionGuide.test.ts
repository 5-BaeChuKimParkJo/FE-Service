import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { DemoAuctionGuide } from './DemoAuctionGuide';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

const auction = {
  isDemo: true,
  auctionUuid: 'demo-fixture',
  startAt: '2026-10-29T00:12:00Z',
  endAt: '2026-10-29T00:17:00Z',
  status: 'active' as const,
};

describe('portfolio demo guidance', () => {
  it.each([false, undefined])(
    'does not label ordinary or legacy auctions as a demo: %s',
    (isDemo) => {
      expect(
        renderToStaticMarkup(
          createElement(DemoAuctionGuide, { ...auction, isDemo }),
        ),
      ).toBe('');
    },
  );

  it('explains the short schedule, shared account, and winner-only test payment without creating a checkout link', () => {
    const html = renderToStaticMarkup(createElement(DemoAuctionGuide, auction));
    expect(html).toContain('5분 체험 경매');
    expect(html).toContain('공유');
    expect(html).toContain('낙찰자');
    expect(html).toContain('실제 배송');
    expect(html).not.toContain('/checkout');
    expect(html).toMatch(/aria-current="step"[^>]*>[\s\S]*?입찰/);
  });

  it('describes the server-confirmed ended phase without claiming that a payment succeeded', () => {
    const html = renderToStaticMarkup(
      createElement(DemoAuctionGuide, { ...auction, status: 'ended' }),
    );
    expect(html).toContain('경매가 마감되었습니다');
    expect(html).toContain('낙찰자만');
    expect(html).not.toContain('결제 완료');
  });
});
