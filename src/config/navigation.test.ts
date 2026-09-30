import { describe, expect, it } from 'vitest';
import { primaryNavigation } from './navigation';

describe('primaryNavigation', () => {
  it('exposes only working real-user routes', () => {
    expect(primaryNavigation).toEqual([
      { href: '/', label: '홈' },
      { href: '/auctions', label: '경매' },
      { href: '/search', label: '검색' },
      { href: '/mypage', label: '내정보' },
    ]);
    expect(primaryNavigation.map((item) => item.href)).not.toContain('/products');
    expect(primaryNavigation.map((item) => item.href)).not.toContain('/chat');
  });
});
