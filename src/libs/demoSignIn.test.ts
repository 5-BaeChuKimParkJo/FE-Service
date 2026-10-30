import { describe, expect, it } from 'vitest';
import { demoReturnTo, getDemoModes } from './demoSignIn';

describe('configured demo personas', () => {
  it('exposes only complete distinct credential pairs without private fields', () => {
    const config = {
      DEMO_MEMBER_ID: 'buyer',
      DEMO_MEMBER_PASSWORD: 'private-buyer',
      DEMO_SELLER_MEMBER_ID: 'seller',
      DEMO_SELLER_MEMBER_PASSWORD: 'private-seller',
    };
    expect(getDemoModes(config)).toEqual(['buyer', 'seller']);
    expect(getDemoModes({ ...config, DEMO_SELLER_MEMBER_ID: 'buyer' })).toEqual(
      ['buyer'],
    );
    expect(
      getDemoModes({ ...config, DEMO_SELLER_MEMBER_PASSWORD: '' }),
    ).toEqual(['buyer']);
    expect(
      getDemoModes({
        DEMO_SELLER_MEMBER_ID: 'seller',
        DEMO_SELLER_MEMBER_PASSWORD: 'private-seller',
      }),
    ).toEqual(['seller']);
    expect(getDemoModes({})).toEqual([]);
  });
  it('keeps internal caller redirects and otherwise uses the persona destination', () => {
    expect(demoReturnTo('buyer')).toBe('/');
    expect(demoReturnTo('seller')).toBe('/mypage/sales');
    expect(demoReturnTo('buyer', '/auctions/fixture')).toBe(
      '/auctions/fixture',
    );
    for (const path of [
      'https://example.test',
      '//example.test',
      '/\\example.test',
      '/\n/example.test',
    ])
      expect(demoReturnTo('seller', path)).toBe('/mypage/sales');
  });
});
