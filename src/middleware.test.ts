import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from './middleware';

function request(path: string, accessToken?: string) {
  const headers = accessToken
    ? { cookie: `accessToken=${accessToken}; memberUuid=member-123` }
    : undefined;
  return middleware(new NextRequest(`http://localhost:3000${path}`, { headers }));
}

describe('portfolio browsing routes', () => {
  it.each([
    '/',
    '/auctions',
    '/auctions/auction-123',
    '/search',
    '/search/result?q=watch',
  ])('allows a visitor to browse %s without signing in', (path) => {
    expect(request(path).headers.get('location')).toBeNull();
  });

  it.each([
    '/mypage',
    '/auctions/create',
    '/auctions/auction-123/checkout',
  ])('still sends anonymous visitors from %s to sign in', (path) => {
    const response = request(path);
    expect(response.headers.get('location')).toBe(
      `http://localhost:3000/sign-in?redirect=${encodeURIComponent(path)}`,
    );
  });

  it('keeps signed-in navigation working', () => {
    const response = request('/mypage', 'token-123');
    expect(response.headers.get('location')).toBeNull();
  });
});
