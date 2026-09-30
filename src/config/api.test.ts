import { describe, expect, it } from 'vitest';
import { API_PATHS } from './api';

describe('API_PATHS', () => {
  it('routes the real-user flow through auction-service', () => {
    expect(API_PATHS.categories).toBe('/auction-service/api/v1/categories');
    expect(API_PATHS.auctionDetail('auction-1')).toBe(
      '/auction-service/api/v1/auctions/auction-1',
    );
    expect(API_PATHS.auctionImages).toBe(
      '/auction-service/api/v1/auction-images',
    );
  });
});
