import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { signIn } = vi.hoisted(() => ({ signIn: vi.fn() }));
vi.mock('./sign-in', () => ({ signIn }));

import { signInDemo } from './sign-in-demo';

describe('portfolio demo sign-in', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.DEMO_MEMBER_ID = 'portfolio_demo';
    process.env.DEMO_MEMBER_PASSWORD = 'server-only-password';
    process.env.DEMO_SELLER_MEMBER_ID = 'sellerfixture';
    process.env.DEMO_SELLER_MEMBER_PASSWORD = 'seller-only-password';
    signIn.mockResolvedValue({
      accessToken: 'private-token',
      refreshToken: 'private-refresh',
      memberUuid: 'member-123',
    });
  });

  afterEach(() => {
    delete process.env.DEMO_MEMBER_ID;
    delete process.env.DEMO_MEMBER_PASSWORD;
    delete process.env.DEMO_SELLER_MEMBER_ID;
    delete process.env.DEMO_SELLER_MEMBER_PASSWORD;
  });

  it('signs into the server-held account without returning credentials', async () => {
    expect(await signInDemo()).toEqual({ ok: true });
    expect(signIn).toHaveBeenCalledWith(
      'portfolio_demo',
      'server-only-password',
    );
  });

  it('rejects an unconfigured demo login', async () => {
    delete process.env.DEMO_MEMBER_PASSWORD;
    await expect(signInDemo()).rejects.toThrow('Demo sign-in is unavailable');
    expect(signIn).not.toHaveBeenCalled();
  });

  it('signs in seller normally and never returns account credentials or tokens', async () => {
    expect(await signInDemo('seller')).toEqual({ ok: true });
    expect(signIn).toHaveBeenCalledWith(
      'sellerfixture',
      'seller-only-password',
    );
  });

  it.each(['admin', {}, ['seller'], null])(
    'rejects invalid persona without a sign-in call',
    async (mode) => {
      await expect(signInDemo(mode)).rejects.toThrow(
        'Demo sign-in is unavailable',
      );
      expect(signIn).not.toHaveBeenCalled();
    },
  );

  it('never falls back to buyer when seller credentials are missing or identities match', async () => {
    delete process.env.DEMO_SELLER_MEMBER_PASSWORD;
    await expect(signInDemo('seller')).rejects.toThrow(
      'Demo sign-in is unavailable',
    );
    process.env.DEMO_SELLER_MEMBER_PASSWORD = 'seller-only-password';
    process.env.DEMO_SELLER_MEMBER_ID = process.env.DEMO_MEMBER_ID;
    await expect(signInDemo('seller')).rejects.toThrow(
      'Demo sign-in is unavailable',
    );
    expect(signIn).not.toHaveBeenCalled();
  });

  it('sanitizes a failed normal authentication response', async () => {
    signIn.mockRejectedValue(new Error('private-credential-and-token'));
    await expect(signInDemo('seller')).rejects.toThrow(
      'Demo sign-in is unavailable',
    );
  });
});
