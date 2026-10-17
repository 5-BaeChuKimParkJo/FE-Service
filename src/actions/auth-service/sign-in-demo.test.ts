import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { signIn } = vi.hoisted(() => ({ signIn: vi.fn() }));
vi.mock('./sign-in', () => ({ signIn }));

import { signInDemo } from './sign-in-demo';

describe('portfolio demo sign-in', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.DEMO_MEMBER_ID = 'portfolio_demo';
    process.env.DEMO_MEMBER_PASSWORD = 'server-only-password';
    signIn.mockResolvedValue({
      accessToken: 'private-token',
      refreshToken: 'private-refresh',
      memberUuid: 'member-123',
    });
  });

  afterEach(() => {
    delete process.env.DEMO_MEMBER_ID;
    delete process.env.DEMO_MEMBER_PASSWORD;
  });

  it('signs into the server-held account without returning credentials', async () => {
    expect(await signInDemo()).toEqual({ ok: true });
    expect(signIn).toHaveBeenCalledWith('portfolio_demo', 'server-only-password');
  });

  it('rejects an unconfigured demo login', async () => {
    delete process.env.DEMO_MEMBER_PASSWORD;
    await expect(signInDemo()).rejects.toThrow('Demo sign-in is unavailable');
    expect(signIn).not.toHaveBeenCalled();
  });
});
