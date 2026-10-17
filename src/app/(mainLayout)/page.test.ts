import { beforeEach, describe, expect, it, vi } from 'vitest';

const { auth, getMyInfo, getCategories } = vi.hoisted(() => ({
  auth: vi.fn(),
  getMyInfo: vi.fn(),
  getCategories: vi.fn(),
}));
vi.mock('@/actions/auth', () => ({ auth }));
vi.mock('@/actions/member-service/get-my-info', () => ({ getMyInfo }));
vi.mock('@/actions/category-service/get-categories', () => ({ getCategories }));
vi.mock('@/components/auction', () => ({ AuctionPreviewSection: () => null }));
vi.mock('@/components/category', () => ({ CategorySlider: () => null }));
vi.mock('@/components/members', () => ({
  MemberInfoSection: () => null,
  MemberInfoSectionSkeleton: () => null,
}));

import Home from './page';

describe('home for visitors', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    auth.mockResolvedValue(null);
    getCategories.mockResolvedValue([]);
  });

  it('renders without asking the member API for private profile data', async () => {
    getMyInfo.mockRejectedValue(new Error('unauthorized'));
    await expect(Home()).resolves.toBeDefined();
    expect(getMyInfo).not.toHaveBeenCalled();
  });
});
